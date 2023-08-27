from fastapi import APIRouter, Body
from database import crud, models
from database.database import SessionLocal, engine
import ioc_analyzer
from ai_assistant import ask_prompt
import domain_monitoring
import newsfeed

router = APIRouter()
models.Base.metadata.create_all(bind=engine)


@router.get("/api/ip/abuseipdb/{ip}", tags=["IP addresses"])
async def abuseipdb(ip):
    '''
    Get IP reputation from AbuseIPDB
    '''
    apikey = crud.get_apikey(name="abuseipdb", db=SessionLocal())
    return ioc_analyzer.abuseipdb_ip_check(ip, apikey['key'])


@router.get("/api/ip/alienvault", tags=["IP addresses"])
async def alienvault_ip(ioc=str()):
    '''
    Get IP reputation from AlienVault OTX
    '''
    apikey = crud.get_apikey(name="alienvault", db=SessionLocal())
    return ioc_analyzer.alienvaultotx(ioc, 'ip', apikey['key'])


@router.get("/api/hash/alienvault", tags=["Hashes"])
async def alienvault_hash(ioc=str()):
    '''
    Get Hash reputation from AlienVault OTX
    '''
    apikey = crud.get_apikey(name="alienvault", db=SessionLocal())
    return ioc_analyzer.alienvaultotx(ioc, 'hash', apikey['key'])


@router.get("/api/domain/alienvault", tags=["Domains"])
async def alienvault_domain(ioc=str()):
    '''
    Get DOMAIN reputation from AlienVault OTX
    '''
    apikey = crud.get_apikey(name="alienvault", db=SessionLocal())
    return ioc_analyzer.alienvaultotx(ioc, 'domain', apikey['key'])


@router.get("/api/ip/bgpview/{ip}", tags=["IP addresses"])
async def bgpview(ip):
    '''
    Get IP reputation from BGPView
    '''
    return ioc_analyzer.check_bgpview(ip)

# TODO: finish
"""
@router.get("/api/ip/blocklist_de/{ip}", tags=["IP addresses"])
async def blocklistde(ip):
    '''
    Get IP reputation from Blocklist.de
    '''
    return ioc_analyzer.blocklist_de_ip_check(ip)
"""


@router.get("/api/ip/crowdsec/{ip}", tags=["IP addresses"])
async def crowdsec(ip):
    '''
    Get IP reputation from CrowdSec
    '''
    apikey = crud.get_apikey(name="crowdsec", db=SessionLocal())
    return ioc_analyzer.crowdsec(ip, apikey['key'])


@router.get("/api/ip/ipqualityscore/{ip}", tags=["IP addresses"])
async def ipqualityscore(ip):
    '''
    Get IP reputation from IPQualityScore
    '''
    apikey = crud.get_apikey(name="ipqualityscore", db=SessionLocal())
    return ioc_analyzer.ipqualityscore_ip_check(ip, apikey['key'])


@router.get("/api/ip/maltiverse/{ip}", tags=["IP addresses"])
async def maltiverse_ip(ip):
    '''
    Get IP reputation from Maltiverse
    '''
    apikey = crud.get_apikey(name="maltiverse", db=SessionLocal())
    return ioc_analyzer.maltiverse_check(ip, "ip", apikey['key'])


@router.get("/api/domain/maltiverse/{hostname}", tags=["Domains"])
async def maltiverse_domain(hostname):
    '''
    Get hostname reputation from Maltiverse
    '''
    apikey = crud.get_apikey(name="maltiverse", db=SessionLocal())
    return ioc_analyzer.maltiverse_check(hostname, "hostname", apikey['key'])


@router.get("/api/url/checkphish/{url}", tags=["URLs"])
async def checkphish_url(url):
    '''
    Get URL reputation from CheckPhish
    '''
    apikey = crud.get_apikey(name="checkphishai", db=SessionLocal())
    return ioc_analyzer.checkphish_ai(url, apikey['key'])


@router.get("/api/domain/checkphish/{domain}", tags=["Domains"])
async def checkphish_domain(domain):
    '''
    Get URL reputation from CheckPhish
    '''
    apikey = crud.get_apikey(name="checkphishai", db=SessionLocal())
    return ioc_analyzer.checkphish_ai(domain, apikey['key'])


@router.get("/api/ip/checkphish/{ip}", tags=["IP addresses"])
async def checkphish_ip(ip):
    '''
    Get URL reputation from CheckPhish
    '''
    apikey = crud.get_apikey(name="checkphishai", db=SessionLocal())
    return ioc_analyzer.checkphish_ai(ip, apikey['key'])


@router.get("/api/url/maltiverse/{url}", tags=["URLs"])
async def maltiverse_url(url):
    '''
    Get URL reputation from Maltiverse
    '''
    apikey = crud.get_apikey(name="maltiverse", db=SessionLocal())
    return ioc_analyzer.maltiverse_check(url, "url", apikey['key'])


@router.get("/api/hash/maltiverse/{hash}", tags=["Hashes"])
async def maltiverse_hash(hash):
    '''
    Get hash reputation from Maltiverse (SHA256 only)
    '''
    apikey = crud.get_apikey(name="maltiverse", db=SessionLocal())
    return ioc_analyzer.maltiverse_check(hash, "sample", apikey['key'])


@router.get("/api/hash/malwarebazaar/{hash}", tags=["Hashes"])
async def malwarebazaar(hash):
    '''
    Get hash reputation from MalwareBazaar
    '''
    return ioc_analyzer.malwarebazaar_hash_check(hash)


@router.get("/api/newsfeed", tags=["OSINT Toolkit modules"])
async def news():
    '''
    Get news articles from various RSS feeds
    '''
    return newsfeed.get_news()


@router.get("/api/ip/pulsedive", tags=["IP addresses"])
async def pulsedive_ip(ioc=str()):
    '''
    Get IP reputation from Pulsedive
    '''
    apikey = crud.get_apikey(name="pulsedive", db=SessionLocal())
    return ioc_analyzer.check_pulsedive(ioc, apikey['key'])


@router.get("/api/domain/pulsedive", tags=["Domains"])
async def pulsedive_domain(ioc=str()):
    '''
    Get Domains reputation from Pulsedive
    '''
    apikey = crud.get_apikey(name="pulsedive", db=SessionLocal())
    return ioc_analyzer.check_pulsedive(ioc, apikey['key'])


@router.get("/api/hash/pulsedive", tags=["Hashes"])
async def pulsedive_hash(ioc=str()):
    '''
    Get Hash reputation from Pulsedive
    '''
    apikey = crud.get_apikey(name="pulsedive", db=SessionLocal())
    return ioc_analyzer.check_pulsedive(ioc, apikey['key'])


@router.get("/api/domain/safebrowsing", tags=["Domains"])
async def safebrowsing_domain(ioc=str()):
    '''
    Get domain reputation from Google Safe Browsing
    '''
    apikey = crud.get_apikey(name="safebrowsing", db=SessionLocal())
    return ioc_analyzer.safebrowsing_url_check(ioc, apikey['key'])


@router.get("/api/url/safebrowsing", tags=["URLs"])
async def safebrowsing_url(ioc=str()):
    '''
    Get URL reputation from Google Safe Browsing
    '''
    apikey = crud.get_apikey(name="safebrowsing", db=SessionLocal())
    return ioc_analyzer.safebrowsing_url_check(ioc, apikey['key'])


@router.get("/api/ip/shodan", tags=["IP addresses"])
async def shodan_ip(ioc=str()):
    '''
    Get information about IP from Shodan
    '''
    apikey = crud.get_apikey(name="shodan", db=SessionLocal())
    return ioc_analyzer.check_shodan(ioc, 'ip', apikey['key'])


@router.get("/api/domain/shodan", tags=["Domains"])
async def shodan_domain(ioc=str()):
    '''
    Get information about a domain from Shodan
    '''
    apikey = crud.get_apikey(name="shodan", db=SessionLocal())
    return ioc_analyzer.check_shodan(ioc, 'domain', apikey['key'])


@router.get("/api/ip/threatfox/{ip}", tags=["IP addresses"])
async def theatfox(ip):
    '''
    Get IP reputation from ThreatFox
    '''
    apikey = crud.get_apikey(name="threatfox", db=SessionLocal())
    return ioc_analyzer.threatfox_ip_check(ip, apikey['key'])


@router.get("/api/email/hunterio/{email}", tags=["Emails"])
async def hunterio(email):
    '''
    Get email reputation from Hunter.io
    '''
    apikey = crud.get_apikey(name="hunterio", db=SessionLocal())
    return ioc_analyzer.hunter_email_check(email, apikey['key'])


@router.get("/api/email/emailrepio/{email}", tags=["Emails"])
async def emailrepio(email):
    '''
    Get email reputation from emailrep.io
    '''
    apikey = crud.get_apikey(name="emailrepio", db=SessionLocal())
    return ioc_analyzer.emailrep_email_check(email, apikey['key'])


@router.get("/api/email/haveibeenpwnd/{email}", tags=["Emails"])
async def haveibeenpwnd(email):
    '''
    Get email reputation from Have I Been Pwnd
    '''
    apikey = crud.get_apikey(name="hibp", db=SessionLocal())
    return ioc_analyzer.haveibeenpwnd_email_check(email, apikey['key'])


@router.get("/api/cve/nist_nvd/{cve}", tags=["CVEs"])
async def nistnvd(cve):
    '''
    Get information about a CVE from the NIST NVD
    '''
    apikey = crud.get_apikey(name="nist_nvd", db=SessionLocal())

    if not apikey or 'key' not in apikey or not apikey['is_active']:
        return {"error": "No active API key found for NIST NVD"}

    return ioc_analyzer.search_nist_nvd(cve, apikey['key'])


@router.get("/api/socialmedia/twitter/{ioc}", tags=["Social Media"])
async def twitter(ioc):
    '''
    Get latest Twitter Posts for IOC
    '''
    twitter_bearer_token = crud.get_apikey(
        name="twitter_bearer", db=SessionLocal())
    return ioc_analyzer.search_twitter(ioc, twitter_bearer_token['key'])


@router.get("/api/socialmedia/reddit/{ioc}", tags=["Social Media"])
async def reddit(ioc):
    '''
    Get latest Reddit Posts for IOC
    '''
    reddit_cs = crud.get_apikey(name="reddit_cs", db=SessionLocal())
    reddit_cid = crud.get_apikey(name="reddit_cid", db=SessionLocal())
    return ioc_analyzer.search_reddit(ioc=ioc, client_secret=reddit_cs['key'], client_id=reddit_cid['key'])


@router.get("/api/socialmedia/mastodon/{ioc}", tags=["Social Media"])
async def mastodon(ioc):
    '''
    Get latest Mastodon Posts (ioc.exchange) for a specific IOC
    '''
    return ioc_analyzer.mastodon(ioc)


@router.get("/api/url/urlhaus/{url}", tags=["URLs"])
async def urlhaus(url):
    '''
    Get URL reputation from URLhaus
    '''
    return ioc_analyzer.urlhaus_url_check(url)


@router.get("/api/url/urlscanio/{domain}", tags=["URLs"])
async def urlscanio(domain):
    '''
    Get URL reputation from URLscan.io
    '''
    return domain_monitoring.urlscanio(domain)


@router.get("/api/ip/virustotal", tags=["IP addresses"])
async def virustotal_ip(ioc=str()):
    '''
    Get IP reputation from VirusTotal
    '''
    apikey = crud.get_apikey(name="virustotal", db=SessionLocal())
    return ioc_analyzer.virustotal(ioc, 'ip', apikey['key'])


@router.get("/api/domain/virustotal", tags=["Domains"])
async def virustotal_domain(ioc=str()):
    '''
    Get Domain reputation from VirusTotal
    '''
    apikey = crud.get_apikey(name="virustotal", db=SessionLocal())
    return ioc_analyzer.virustotal(ioc, 'domain', apikey['key'])


@router.get("/api/url/virustotal", tags=["URLs"])
async def virustotal_url(ioc=str()):
    '''
    Get URL reputation from VirusTotal
    '''
    apikey = crud.get_apikey(name="virustotal", db=SessionLocal())
    return ioc_analyzer.virustotal(ioc, 'url', apikey['key'])


@router.get("/api/hash/virustotal", tags=["Hashes"])
async def virustotal_hash(ioc=str()):
    '''
    Get hash reputation from VirusTotal
    '''
    apikey = crud.get_apikey(name="virustotal", db=SessionLocal())
    return ioc_analyzer.virustotal(ioc, 'hash', apikey['key'])


@router.get("/api/multi/github", tags=["Multi"])
async def github(ioc=str()):
    '''
    Get search results from GitHub
    '''
    apikey = crud.get_apikey(name="github", db=SessionLocal())
    return ioc_analyzer.search_github(ioc=ioc, access_token=apikey['key'])


@router.post("/api/aiassistant/loganalysis", tags=["AI Assistant"])
async def analyze_logs_endpoint(input: dict = Body(..., example={"input": "YOUR_INPUT_DATA"})):
    '''
    Analyze logdata with OpenAI
    '''
    inputdata = str(input["input"].encode('utf-8'))
    apikey = crud.get_apikey(name="openai", db=SessionLocal())
    analysis_result = ask_prompt(
        inputdata, apikey['key'], 'loganalysis')
    return {"analysis_result": analysis_result}


@router.post("/api/aiassistant/mailanalysis", tags=["AI Assistant"])
async def analyze_mail_endpoint(input: dict = Body(..., example={"input": "YOUR_INPUT_DATA"})):
    '''
    Analyze potential phishing mails with OpenAI
    '''
    inputdata = str(input["input"].encode('utf-8'))
    apikey = crud.get_apikey(name="openai", db=SessionLocal())
    analysis_result = ask_prompt(
        inputdata, apikey['key'], 'emailanalysis')
    return {"analysis_result": analysis_result}


@router.post("/api/aiassistant/codeexpert", tags=["AI Assistant"])
async def analyze_code_endpoint(input: dict = Body(..., example={"input": "YOUR_INPUT_DATA"})):
    '''
    Analyze source code with OpenAI
    '''
    inputdata = str(input["input"].encode('utf-8'))
    apikey = crud.get_apikey(name="openai", db=SessionLocal())
    analysis_result = ask_prompt(
        inputdata, apikey['key'], 'codeexpert')
    return {"analysis_result": analysis_result}
