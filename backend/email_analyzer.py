from email.parser import BytesParser
from email import policy
import hashlib
import re
import logging

response = {}


def extract_email_addresses(header):
    if header is None or not isinstance(header, str):
        return ['none']
    pattern = r'[\w\.-]+@[\w\.-]+'
    email_addresses = re.findall(pattern, header)
    return email_addresses


def get_basic_info(msg):
    return {
        'from': msg['from'],
        'to': msg['to'],
        'return-path': msg['return-path'],
        'subject': msg['subject'],
        'date': msg['date'],
        'dkim': msg['dkim-signature'],
        'domainkey': msg['domainkey-signature'],
        'message-id': msg['message-id']
    }


def basic_security_checks(msg):
    warnings = []
    # Check if 'From' and 'To' fields are the same
    if extract_email_addresses(msg['from']) == extract_email_addresses(msg['to']):
        warnings.append({
            'warning_tlp': 'red',
            'warning_title': "'From' and 'To' fields are the same",
            'warning_message': f"From: {extract_email_addresses(msg['from'])[0]} To: {extract_email_addresses(msg['to'])[0]}"
        })
    else:
        warnings.append({
            'warning_tlp': 'green',
            'warning_title': "'From' and 'To' fields are not the same",
            'warning_message': f"From: {extract_email_addresses(msg['from'])[0]} To: {extract_email_addresses(msg['to'])[0]}"
        })
    # Check if 'From' and 'Return-Path' fields are the same
    if extract_email_addresses(msg['from']) != extract_email_addresses(msg['return-path']):
        warnings.append({
            'warning_tlp': 'red',
            'warning_title': "'From' and 'Return-Path' fields do not match",
            'warning_message': f"From: {extract_email_addresses(msg['from'])[0]} Return-Path: {extract_email_addresses(msg['return-path'])[0]}"
        })
    else:
        warnings.append({
            'warning_tlp': 'green',
            'warning_title': "'From' and 'Return-Path' fields do match",
            'warning_message': f"From: {extract_email_addresses(msg['from'])[0]} Return-Path: {extract_email_addresses(msg['return-path'])[0]}"
        })
    # Check if 'Message-ID' field is present
    if msg['message-id'] == None:
        warnings.append({
            'warning_tlp': 'red',
            'warning_title': "No message ID",
            'warning_message': "Message ID field is empty"
        })
    else:
        warnings.append({
            'warning_tlp': 'green',
            'warning_title': "Message ID found",
            'warning_message': "Message ID field is not empty"
        })
    return warnings


def get_headers(msg):
    header_list = []
    for key, value in msg.items():
        header_list.append({key: value})
    return header_list


# Get hashes of .eml file itself
def get_email_hashes(msg):
    hashes = {}
    hashes['md5'] = hashlib.md5(msg).hexdigest()
    hashes['sha1'] = hashlib.sha1(msg).hexdigest()
    hashes['sha256'] = hashlib.sha256(msg).hexdigest()
    return hashes


# Get message text
def get_text(msg):
    try:
        full_message = []
        if msg.is_multipart():
            for part in msg.walk():
                try:
                    body = part.get_payload(
                        decode=True).decode(errors='ignore')
                    full_message.append(body)
                except Exception as e:
                    logging.error(
                        f"Email analyzer: Error decoding message part: {e}")
                    pass
            return full_message
        else:
            try:
                body = msg.get_payload(decode=True).decode(errors='ignore')
                return body
            except Exception as e:
                logging.error(
                    f"Email analyzer: Error decoding message body: {e}")
                pass
    except Exception as e:
        logging.error(f"Email analyzer: Error getting message text: {e}")
        pass


# Get attachements
def get_attachments(msg):
    attachments = []
    for attachment in msg.iter_attachments():
        file = {}
        file["filename"] = attachment.get_filename()
        file["md5"] = hashlib.md5(
            attachment.get_payload(decode=True)).hexdigest()
        file["sha1"] = hashlib.sha1(
            attachment.get_payload(decode=True)).hexdigest()
        file["sha256"] = hashlib.sha256(
            attachment.get_payload(decode=True)).hexdigest()
        attachments.append(file)
    return attachments


# get hops
def get_hops(msg):
    hops = []
    hops_parsed = []
    for key, value in msg.items():
        if key == "Received":
            hops.append(value)
    hop_number = len(hops)+1
    for hop in hops:
        hop_number -= 1
        if "from" in hop and "by" in hop:
            from_value = hop.split("from ")[1].split("by")[0].strip()
            by_value = hop.split("by ")[1].split(" ")[0].strip()
            if "with" in hop:
                with_value = hop.split("with ")[1].split(";")[0].strip()
            else:
                with_value = None
            date_value = hop.split(";", 1)[1].strip()
            hops_parsed.append({'number': hop_number, 'from': from_value,
                               'by': by_value, 'with': with_value, 'date': date_value})
        else:
            logging.warning(
                f"hop does not contain all the required substrings: {hop}")
    return hops_parsed


# Get URLs
def get_urls(msg):
    text = get_text(msg)
    urls = []
    urls_cleaned = []
    urls = re.findall(
        r'(http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+)', str(text))
    for url in urls:
        url = re.split(r'>|<|\\|\(', url)[0]
        urls_cleaned.append(url)
    return list(dict.fromkeys(urls_cleaned))


# Analyze email and return response
def analyze_email(data):
    msg = BytesParser(policy=policy.default).parsebytes(data)
    response['basic_info'] = get_basic_info(msg)
    response['headers'] = get_headers(msg)
    response['eml_hashes'] = get_email_hashes(data)
    response['attachments'] = get_attachments(msg)
    response['hops'] = get_hops(msg)
    response['warnings'] = basic_security_checks(msg)
    response['urls'] = get_urls(msg)
    response['message_text'] = get_text(msg)
    return response
