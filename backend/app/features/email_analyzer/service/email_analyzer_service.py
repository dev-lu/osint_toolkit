from email.parser import BytesParser
from email import policy, message
from email.message import EmailMessage
import hashlib
import re
import logging
import unicodedata as ud
from typing import List, Dict, Any, Optional, Set, Union
from dataclasses import dataclass
from functools import lru_cache


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class Warning:
    """Structure for email security warnings"""
    warning_tlp: str
    warning_title: str
    warning_message: str

@dataclass
class HopInfo:
    """Structure for email hop information"""
    number: int
    from_server: Optional[str]
    by_server: Optional[str]
    with_protocol: Optional[str]
    date: Optional[str]
    parse_error: Optional[str] = None

@dataclass
class AttachmentInfo:
    """Structure for email attachment information"""
    filename: str
    md5: str
    sha1: str
    sha256: str

def calculate_hash(data: bytes, hash_type: str = 'sha256') -> str:
    """Calculate hash of given data using specified algorithm"""
    hash_functions = {
        'md5': hashlib.md5,
        'sha1': hashlib.sha1,
        'sha256': hashlib.sha256
    }
    
    if hash_type not in hash_functions:
        raise ValueError(f"Unsupported hash type: {hash_type}")
        
    return hash_functions[hash_type](data).hexdigest()

def extract_email_addresses(header: Optional[str]) -> List[str]:
    """Extract email addresses from header field"""
    if not header or not isinstance(header, str):
        return ['none']
        
    pattern = r'[\w\.-]+@[\w\.-]+'
    try:
        return re.findall(pattern, header)
    except Exception as e:
        logger.error(f"Error extracting email addresses: {str(e)}")
        return ['none']

def get_basic_info(msg: EmailMessage) -> Dict[str, Optional[str]]:
    """Extract basic information from email message"""
    headers = [
        'from', 'to', 'delivered-to', 'rcpt-to', 'cc', 'return-path',
        'subject', 'date', 'dkim-signature', 'domainkey-signature', 'message-id'
    ]
    return {header: msg[header] for header in headers}

@lru_cache(maxsize=1024)
def check_homograph_attack(text: Optional[Union[str, bytes]]) -> bool:
    """Check for possible homograph attacks in text"""
    if not text or not isinstance(text, (str, bytes)):
        logger.error(f"Invalid input for homograph check: {type(text).__name__}")
        return False

    try:
        # Remove safe characters and analyze scripts
        cleaned_text = re.sub(r'[<@.,-_> "]', '', str(text))
        scripts: Set[str] = {ud.name(char).split(' ')[0] for char in cleaned_text}
        scripts.discard('LATIN')
        return len(scripts) > 1
    except Exception as e:
        logger.error(f"Error in homograph attack check: {str(e)}")
        return False

def basic_security_checks(msg: EmailMessage) -> List[Warning]:
    """Perform basic security checks on email message"""
    warnings: List[Warning] = []
    
    try:
        from_addresses = extract_email_addresses(msg['from'])
        to_addresses = extract_email_addresses(msg['to'])
        return_path = extract_email_addresses(msg['return-path'])
        
        # Check From and To fields
        if from_addresses == to_addresses:
            warnings.append(Warning(
                warning_tlp='red',
                warning_title="'From' and 'To' fields are the same",
                warning_message=f"From: {from_addresses[0]} To: {to_addresses[0]}"
            ))
        else:
            warnings.append(Warning(
                warning_tlp='green',
                warning_title="'From' and 'To' fields are not the same",
                warning_message=f"From: {from_addresses[0]} To: {to_addresses[0]}"
            ))
        
        # Check Return-Path
        if from_addresses != return_path:
            warnings.append(Warning(
                warning_tlp='red',
                warning_title="'From' and 'Return-Path' fields do not match",
                warning_message=f"From: {from_addresses[0]} Return-Path: {return_path[0]}"
            ))
        else:
            warnings.append(Warning(
                warning_tlp='green',
                warning_title="'From' and 'Return-Path' fields do match",
                warning_message=f"From: {from_addresses[0]} Return-Path: {return_path[0]}"
            ))
        
        # Check Message-ID
        if msg['message-id'] is None:
            warnings.append(Warning(
                warning_tlp='red',
                warning_title="No message ID",
                warning_message="Message ID field is empty"
            ))
        else:
            warnings.append(Warning(
                warning_tlp='green',
                warning_title="Message ID found",
                warning_message="Message ID field is not empty"
            ))
        
        if check_homograph_attack(msg['return-path']) or check_homograph_attack(msg['from']):
            warnings.append(Warning(
                warning_tlp='red',
                warning_title="Possible homograph attack detected",
                warning_message="Multiple Unicode scripts detected in From/Return-Path fields"
            ))
        else:
            warnings.append(Warning(
                warning_tlp='green',
                warning_title="No indicators for homograph attack detected",
                warning_message="Single Unicode script in From/Return-Path fields"
            ))
    
    # Check for suspicious Subject patterns
        subject = msg['subject'] or ""
        suspicious_subject_patterns = [
            "urgent", "password", "account", "verify", "bank", "update", "security",
            "login", "suspend", "unusual activity", "confirm your", "verify your",
            "reset", "credit card", "payment", "invoice", "statement", "tax"
        ]
        
        if any(pattern.lower() in subject.lower() for pattern in suspicious_subject_patterns):
            warnings.append(Warning(
                warning_tlp='amber',
                warning_title="Suspicious subject line detected",
                warning_message=f"Subject '{subject}' contains potential phishing keywords"
            ))
        
        # Check for suspicious attachment types
        for attachment in msg.iter_attachments():
            filename = attachment.get_filename()
            if filename:
                file_ext = os.path.splitext(filename)[1].lower()
                suspicious_extensions = [
                    '.exe', '.bat', '.cmd', '.scr', '.js', '.vbs', '.hta', '.msi', 
                    '.ps1', '.psd1', '.psm1', '.jar', '.reg', '.dll', '.com'
                ]
                
                if file_ext in suspicious_extensions:
                    warnings.append(Warning(
                        warning_tlp='red',
                        warning_title="Suspicious attachment detected",
                        warning_message=f"Email contains potentially malicious attachment: {filename}"
                    ))
                
                # Check for extension mismatch (double extension)
                if filename.count('.') > 1:
                    warnings.append(Warning(
                        warning_tlp='red',
                        warning_title="Potential extension spoofing",
                        warning_message=f"Attachment '{filename}' has multiple extensions"
                    ))
        
        # Check for empty sender
        if not from_addresses:
            warnings.append(Warning(
                warning_tlp='red',
                warning_title="Empty sender field",
                warning_message="The 'From' field is empty"
            ))
        
        # Check for SPF, DKIM and DMARC headers
        auth_results = msg.get_all('authentication-results')
        if not auth_results:
            warnings.append(Warning(
                warning_tlp='amber',
                warning_title="No authentication results",
                warning_message="No SPF/DKIM/DMARC authentication results found"
            ))
        else:
            # Check SPF
            if not any('spf=pass' in result.lower() for result in auth_results):
                warnings.append(Warning(
                    warning_tlp='amber',
                    warning_title="SPF failure",
                    warning_message="SPF validation did not pass"
                ))
            
            # Check DKIM
            if not any('dkim=pass' in result.lower() for result in auth_results):
                warnings.append(Warning(
                    warning_tlp='amber',
                    warning_title="DKIM failure",
                    warning_message="DKIM signature validation did not pass"
                ))
            
            # Check DMARC
            if not any('dmarc=pass' in result.lower() for result in auth_results):
                warnings.append(Warning(
                    warning_tlp='amber',
                    warning_title="DMARC failure",
                    warning_message="DMARC validation did not pass"
                ))
        
        # Check for reply-to mismatch
        reply_to = extract_email_addresses(msg['reply-to'])
        if reply_to and from_addresses and reply_to != from_addresses:
            warnings.append(Warning(
                warning_tlp='amber',
                warning_title="Reply-To mismatch",
                warning_message=f"Reply-To address ({reply_to[0]}) doesn't match From address ({from_addresses[0]})"
            ))
        
        # Check for BCC field (unusual in legitimate emails)
        if msg['bcc']:
            warnings.append(Warning(
                warning_tlp='amber',
                warning_title="BCC field present",
                warning_message="Email contains BCC recipients"
            ))
        
        # Check date for anomalies
        date_header = msg['date']
        if date_header:
            try:
                email_date = parsedate_to_datetime(date_header)
                current_time = datetime.now(timezone.utc)
                time_diff = current_time - email_date
                
                # Future date check
                if email_date > current_time:
                    warnings.append(Warning(
                        warning_tlp='red',
                        warning_title="Future date detected",
                        warning_message=f"Email has a future date: {date_header}"
                    ))
                
                # Too old check (older than 7 days)
                if time_diff.days > 7:
                    warnings.append(Warning(
                        warning_tlp='amber',
                        warning_title="Old email",
                        warning_message=f"Email is {time_diff.days} days old"
                    ))
            except Exception:
                warnings.append(Warning(
                    warning_tlp='amber',
                    warning_title="Invalid date format",
                    warning_message=f"Email has an invalid date format: {date_header}"
                ))
        
        # Check for URL redirection in HTML content
        for part in msg.walk():
            if part.get_content_type() == "text/html":
                html_content = part.get_content()
                
                # Check for URL redirection
                if re.search(r'href=["\']https?://(?!www\.|mail\.)(.*?)["\'].*?>.*?(?:click|https?://www\.)', html_content, re.I):
                    warnings.append(Warning(
                        warning_tlp='amber',
                        warning_title="Potential URL redirection",
                        warning_message="Email contains links with potential URL redirection"
                    ))
                
                # Check for obscured URLs
                if re.search(r'href=["\']https?://[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}', html_content, re.I):
                    warnings.append(Warning(
                        warning_tlp='amber',
                        warning_title="IP address URL detected",
                        warning_message="Email contains links with raw IP addresses"
                    ))
                    
                # Check for data: URI schemes which can be used for XSS
                if 'data:text/html' in html_content or 'data:application/javascript' in html_content:
                    warnings.append(Warning(
                        warning_tlp='red',
                        warning_title="Data URI scheme detected",
                        warning_message="Email contains potentially malicious data URI schemes"
                    ))
                
                # Check for encoded URLs
                if re.search(r'href=["\'](?:https?:\/\/)?(?:%[0-9A-Fa-f]{2})+', html_content, re.I):
                    warnings.append(Warning(
                        warning_tlp='amber',
                        warning_title="Encoded URL detected",
                        warning_message="Email contains URL-encoded links which may be suspicious"
                    ))
        
        # Check X-Mailer header for known suspicious mailers
        x_mailer = msg['x-mailer']
        suspicious_mailers = ['php', 'script', 'bulk', 'mass']
        if x_mailer and any(mailer in x_mailer.lower() for mailer in suspicious_mailers):
            warnings.append(Warning(
                warning_tlp='amber',
                warning_title="Suspicious mailer detected",
                warning_message=f"Email sent using potentially suspicious mailer: {x_mailer}"
            ))
        
        # Check if email was sent through multiple servers (multiple Received headers)
        received_headers = msg.get_all('received')
        if received_headers and len(received_headers) > 5:
            warnings.append(Warning(
                warning_tlp='amber',
                warning_title="Multiple relay servers",
                warning_message=f"Email passed through {len(received_headers)} servers"
            ))
            
    except Exception as e:
        logger.error(f"Error in security checks: {str(e)}")
        warnings.append(Warning(
            warning_tlp='red',
            warning_title="Error in security checks",
            warning_message=f"Error performing security checks: {str(e)}"
        ))
    
    return warnings

def get_headers(msg: EmailMessage) -> List[Dict[str, str]]:
    """Get all headers from email message"""
    return [{key: value} for key, value in msg.items()]

def get_email_hashes(data: bytes) -> Dict[str, str]:
    """Calculate hashes of email data"""
    return {
        hash_type: calculate_hash(data, hash_type)
        for hash_type in ['md5', 'sha1', 'sha256']
    }

def get_text(msg: EmailMessage) -> Union[List[str], str]:
    """Extract text content from email message"""
    try:
        if msg.is_multipart():
            full_message = []
            for part in msg.walk():
                try:
                    body = part.get_payload(decode=True)
                    if body:
                        full_message.append(body.decode(errors='ignore'))
                except Exception as e:
                    logger.error(f"Error decoding message part: {str(e)}")
            return full_message
        else:
            body = msg.get_payload(decode=True)
            return body.decode(errors='ignore') if body else ""
    except Exception as e:
        logger.error(f"Error getting message text: {str(e)}")
        return ""

def get_attachments(msg: EmailMessage) -> List[AttachmentInfo]:
    """Extract and analyze attachments from email message"""
    attachments = []
    try:
        for attachment in msg.iter_attachments():
            payload = attachment.get_payload(decode=True)
            if payload:
                attachments.append(AttachmentInfo(
                    filename=attachment.get_filename() or "unknown",
                    md5=calculate_hash(payload, 'md5'),
                    sha1=calculate_hash(payload, 'sha1'),
                    sha256=calculate_hash(payload, 'sha256')
                ))
    except Exception as e:
        logger.error(f"Error processing attachments: {str(e)}")
    
    return attachments

def parse_hop(hop: str, number: int) -> dict:
    """
    Parse a single email hop with detailed information extraction.
    
    Args:
        hop: Raw hop string from email headers
        number: Hop number in sequence
        
    Returns:
        Dictionary containing parsed hop information
    """
    try:
        # Initialize hop data
        hop_data = {
            'number': number,
            'from': None,
            'by': None,
            'with': None,
            'date': None
        }

        # Split into main part and date
        parts = hop.split(";", 1)
        main_part = parts[0]
        
        # Extract date if available
        if len(parts) > 1:
            hop_data['date'] = parts[1].strip()

        # Extract IP addresses
        ip_pattern = r'\(((?:\d{1,3}\.){3}\d{1,3}|(?:[0-9a-fA-F:]+))\)'
        ip_addresses = re.findall(ip_pattern, main_part)

        # Parse from information
        if "from" in main_part:
            from_parts = main_part.split("from ", 1)
            if len(from_parts) > 1:
                from_info = from_parts[1].split(None, 1)[0].strip()
                # Add IP if available
                if ip_addresses and "from" in main_part.split("from", 1)[1].split("by", 1)[0]:
                    from_info = f"{from_info} ({ip_addresses[0]})"
                hop_data['from'] = from_info

        # Parse by information
        if "by" in main_part:
            by_parts = main_part.split("by ", 1)
            if len(by_parts) > 1:
                by_info = by_parts[1].split(None, 1)[0].strip()
                # Add IP if available
                remaining_ips = [ip for ip in ip_addresses if ip not in str(hop_data['from'])]
                if remaining_ips and "by" in main_part.split("by", 1)[1]:
                    by_info = f"{by_info} ({remaining_ips[0]})"
                hop_data['by'] = by_info

        # Parse with information
        if "with" in main_part:
            with_parts = main_part.split("with ", 1)
            if len(with_parts) > 1:
                hop_data['with'] = with_parts[1].split(None, 1)[0].strip()

        return hop_data

    except Exception as e:
        logger.error(f"Error parsing hop {number}: {str(e)}")
        return {
            'number': number,
            'from': None,
            'by': None,
            'with': None,
            'date': None,
            'parse_error': str(e)
        }

def get_hops(msg: EmailMessage) -> List[Dict[str, Any]]:
    """
    Extract and parse email hops from message headers.
    
    Args:
        msg: Email message object
        
    Returns:
        List of dictionaries containing parsed hop information
    """
    hops = []
    try:
        received_headers = []
        for key, value in msg.items():
            if key == "Received":
                received_headers.append(value)
        
        hop_number = len(received_headers)
        for hop in received_headers:
            hop_data = parse_hop(hop, hop_number)
            hops.append(hop_data)
            hop_number -= 1
            
        hops.reverse()
        
    except Exception as e:
        logger.error(f"Error getting hops: {str(e)}")
    
    return hops

def get_urls(msg: EmailMessage) -> List[str]:
    """Extract URLs from email message"""
    text = get_text(msg)
    url_pattern = r'(http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+)'
    try:
        urls = re.findall(url_pattern, str(text))
        cleaned_urls = [re.split(r'>|<|\\|\(', url)[0] for url in urls]
        return list(dict.fromkeys(cleaned_urls))
    except Exception as e:
        logger.error(f"Error extracting URLs: {str(e)}")
        return []

def analyze_email(data: bytes) -> Dict[str, Any]:
    """
    Analyze email data and return comprehensive analysis results
    
    Args:
        data: Raw email data in bytes
        
    Returns:
        Dictionary containing analysis results
    """
    try:
        msg = BytesParser(policy=policy.default).parsebytes(data)
        
        return {
            'basic_info': get_basic_info(msg),
            'headers': get_headers(msg),
            'eml_hashes': get_email_hashes(data),
            'attachments': get_attachments(msg),
            'hops': get_hops(msg),
            'warnings': [vars(w) for w in basic_security_checks(msg)],
            'urls': get_urls(msg),
            'message_text': get_text(msg)
        }
    except Exception as e:
        logger.error(f"Error analyzing email: {str(e)}", exc_info=True)
        return {
            'error': str(e),
            'status': 'failed'
        }