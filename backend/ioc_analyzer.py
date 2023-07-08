import requests
import json
import regex as re
from collections import OrderedDict
from datetime import datetime
from time import sleep


# ===========================================================================
# IPv4
# ===========================================================================
def virustotal(ioc: str, type: str, apikey: str, proxies: dict):
    if type == "ip":
        endpoint = "ip_addresses"
    elif type == "domain":
        endpoint = "domains"
    elif type == "url":
        endpoint = "urls"
    elif type == "hash":
        endpoint = "files"
    else:
        return {"error": "unknown ioc type"}
    url = f"https://www.virustotal.com/api/v3/{endpoint}/{ioc}"
    apikey = apikey
    if not apikey:
        apikey = ""
    headers = {
        "x-apikey": apikey
    }
    response = requests.get(url=url,
                            headers=headers,
                            proxies=proxies)
    response_json = json.loads(response.text)
    if response.status_code == 200:
        response_json = json.loads(response.text)
        return response_json
    else:
        return {"error": response.status_code}


def maltiverse_check(ip: str, endpoint: str, apikey: str, proxies: dict):
    apikey = apikey
    headers = {
        'Authorization': f'Bearer {apikey}'
    }

    url = f"https://api.maltiverse.com/{endpoint}/"
    response = requests.get(url=f"{url}{ip}",
                            headers=headers,
                            proxies=proxies)
    response_json = json.loads(response.text)
    if response.status_code == 200:
        response_json = json.loads(response.text)
        return response_json
    else:
        return {"error": response.status_code}

# ===========================================================================
# IPv6
# ===========================================================================

# ===========================================================================
# IPv4 / IPv6
# ===========================================================================


def abuseipdb_ip_check(ip: str, apikey: str, proxies: dict):
    apikey = apikey
    if not apikey:
        apikey = ""
    url = "https://api.abuseipdb.com/api/v2"
    endpoint = "/check"
    headers = {
        'Accept': 'application/json',
        'Key': apikey
    }
    querystring = {
        'ipAddress': ip,
        'maxAgeInDays': '365'
    }
    response = requests.get(url=url + endpoint,
                            headers=headers,
                            params=querystring,
                            proxies=proxies)
    if response.status_code == 200:
        response_json = json.loads(response.text)
        return response_json
    else:
        return {"error": response.status_code}


def alienvaultotx(ioc: str, type: str, apikey: str, proxies: dict):
    if type == "ip":
        endpoint = "IPv4"
    elif type == "hash":
        endpoint = "file"
    elif type == "domain":
        endpoint = "domain"
    else:
        return {"error": "unknown ioc type"}
    url = f"https://otx.alienvault.com/api/v1/indicators/{endpoint}/{ioc}"
    apikey = apikey
    if not apikey:
        apikey = ""
    headers = {
        "X-OTX-API-Key": apikey
    }
    response = requests.get(url=url,
                            headers=headers,
                            proxies=proxies)
    if response.status_code == 200:
        response_json = json.loads(response.text)
        return response_json
    else:
        return {"error": response.status_code}


# TODO: Other IOC types than IPs
def threatfox_ip_check(ip: str, apikey: str, proxies: dict):
    apikey = apikey
    url = "https://threatfox-api.abuse.ch/api/v1/"
    headers = {
        "API-KEY": apikey
    }
    payload = {
        "query": "search_ioc",
        "search_term": ip
    }
    payload_json = json.dumps(payload)
    response = requests.post(url=url,
                             headers=headers,
                             data=payload_json,
                             proxies=proxies)
    response_json = json.loads(response.text)
    if response.status_code == 200:
        response_json = json.loads(response.text)
        return response_json
    else:
        return {"error": response.status_code}


# TODO: Finish implementation
'''
def blocklist_de_ip_check(ip:str, proxies:dict):
    url = "http://api.blocklist.de/api.php?"
    endpoint = "ip="
    response = requests.get(url=url + endpoint + ip, proxies=proxies)
    result = response.text.replace("<br />", " ")
    attacks = re.search('attacks: (\d+)', result).group(1)
    reports = re.search('reports: (\d+)', result).group(1)
    result_dict = {
        "attacks": attacks,
        "reports": reports
    }
    match response.status_code:
        case 401: result_dict = {"error": 401}
        case 429: result_dict = {"error": 429}
    return result_dict
'''

# TODO: Implement other IOC types


def check_pulsedive(ioc: str, apikey: str, proxies: dict):
    apikey = apikey
    url = f"https://pulsedive.com/api/"
    endpoint = f"explore.php?q=ioc%3D{ioc}&limit=10&pretty=1&key={apikey}"
    response = requests.get(url=url + endpoint, proxies=proxies)
    response_json = json.loads(response.text)
    if response.status_code == 200:
        response_json = json.loads(response.text)
        return response_json
    else:
        return {"error": response.status_code}


def check_bgpview(ip: str, proxies: dict):
    url = f"https://api.bgpview.io/ip/{ip}"
    response = requests.get(url=url, proxies=proxies)
    response_json = json.loads(response.text)
    if response.status_code == 200:
        response_json = json.loads(response.text)
        return response_json
    else:
        return {"error": response.status_code}


def ipqualityscore_ip_check(ip: str, apikey: str, proxies: dict):
    apikey = apikey
    endpoint = f"https://ipqualityscore.com/api/json/ip/{apikey}/{ip}"
    response = requests.get(url=endpoint, proxies=proxies)
    response_json = json.loads(response.text)
    if response.status_code == 200:
        response_json = json.loads(response.text)
        return response_json
    else:
        return {"error": response.status_code}


# ===========================================================================
# Domains
# ===========================================================================


# ===========================================================================
# URLs
# ===========================================================================
def urlscanio(domain: str, proxies: dict):
    url = f"https://urlscan.io/api/v1/search/?q=domain:{domain}"
    response = requests.get(url=url, proxies=proxies)
    response_json = [dict(item, expanded=False)
                     for item in response.json()['results']]
    if response.status_code == 200:
        response_json = json.loads(response.text)
        return response_json
    else:
        return {"error": response.status_code}


def urlhaus_url_check(url: str, proxies: dict):
    import urllib.parse
    url = "https://urlhaus-api.abuse.ch/v1/url/"
    data = {
        'url': urllib.parse.quote_plus(url)
    }
    response = requests.post(url=url,
                             data=data,
                             proxies=proxies)
    response_json = json.loads(response.text)
    if response.status_code == 200:
        response_json = json.loads(response.text)
        return response_json
    else:
        return {"error": response.status_code}

# Domains, URLs, IPs


def checkphish_ai(ioc: str, apikey: str):
    scan_url = 'https://developers.checkphish.ai/api/neo/scan'
    scan_data = {
        'apiKey': apikey,
        'urlInfo': {'url': ioc}
    }
    headers = {'Content-Type': 'application/json'}
    scan_response = requests.post(
        url=scan_url, headers=headers, data=json.dumps(scan_data))
    match scan_response.status_code:
        case 401: return {"error": 401}
        case 429: return {"error": 429}
    status_url = 'https://developers.checkphish.ai/api/neo/scan/status'
    status_data = {
        'apiKey': apikey,
        'jobID': scan_response.json()['jobID'],
        'insights': True
    }
    print(scan_response.json())
    if scan_response.json()['jobID'] == 'none':
        if scan_response.json()['errorMessage']:
            return {"error": scan_response.json()['errorMessage']}
        return {"error": 404}
    for i in range(5):
        status_response = requests.post(
            url=status_url, headers=headers, json=status_data)
        match status_response.status_code:
            case 401: return {"error": 401}
            case 429: return {"error": 429}
        status_response_json = status_response.json()
        if status_response_json['status'] == 'DONE':
            return status_response_json
        sleep(5)
    return


# Domains and URLs for Safebrowsing
def safebrowsing_url_check(ioc: str, apikey: str, proxies: dict):
    apikey = apikey
    url = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={apikey}"
    headers = {'Content-type': 'application/json'}
    data = {
        "client": {
            "clientId":      "OSINT Toolkit",
            "clientVersion": "0.1"
        },
        "threatInfo": {
            "threatTypes":      ["MALWARE",
                                 "SOCIAL_ENGINEERING",
                                 "THREAT_TYPE_UNSPECIFIED",
                                 "UNWANTED_SOFTWARE",
                                 "POTENTIALLY_HARMFUL_APPLICATION"],
            "platformTypes":    ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [
                {"url": f"{ioc}"}
            ]
        }
    }
    response = requests.post(url=url,
                             headers=headers,
                             data=json.dumps(data),
                             proxies=proxies)
    response_json = json.loads(response.text)
    if response.status_code == 200:
        response_json = json.loads(response.text)
        return response_json
    else:
        return {"error": response.status_code}


# ===========================================================================
# Emails
# ===========================================================================
def hunter_email_check(email: str, apikey: str, proxies: dict):
    apikey = apikey
    url = f"https://api.hunter.io/v2/email-verifier?email={email}&api_key={apikey}"
    response = requests.get(url=url, proxies=proxies)
    response_json = json.loads(response.text)
    if response.status_code == 200:
        response_json = json.loads(response.text)
        return response_json
    else:
        return {"error": response.status_code}


def emailrep_email_check(email: str, apikey: str, proxies: dict):
    url = f"https://emailrep.io/{email}"
    headers = {'key': apikey, 'User-Agent': 'OSINT Toolkit'}
    response = requests.get(url=url,
                            headers=headers,
                            proxies=proxies)
    response_json = json.loads(response.text)
    if response.status_code == 200:
        response_json = json.loads(response.text)
        return response_json
    else:
        return {"error": response.status_code}


def haveibeenpwnd_email_check(email: str, apikey: str, proxies: dict):
    services = ['pasteaccount', 'breachedaccount']
    headers = {'hibp-api-key': apikey, 'User-Agent': 'OSINT Toolkit'}
    result = {}
    for service in services:
        response = requests.get(
            url=f"https://haveibeenpwned.com/api/v3/{service}/{email}",
            headers=headers,
            proxies=proxies)
        match response.status_code:
            case 401: return {"error": 401}
            case 429: return {"error": 429}
        sleep(6)  # Rate limiting is 1 request per 5 seconds
        if response.content:
            result[service] = json.loads(response.content)
        else:
            result[service] = None
    return result


'''
API is not free of charge. Here for future implementation.
# https://haveibeenpwned.com/API/v3
def haveibeenpwned_email_check(email:str, apikey: str):
    url = f"https://haveibeenpwned.com/api/v3/breachedaccount/{email}"
    headers = {'hibp-api-key': apikey, 'User-Agent': 'OSINT Toolkit'}
    response = requests.get(url=url, headers=headers)
    response_json = json.loads(response.text)
    return response_json

def haveibeenpwned_pastes_check(email:str, apikey: str):
    url = f"https://haveibeenpwned.com/api/v3/pasteaccount/{email}"
    headers = {'hibp-api-key': apikey, 'User-Agent': 'OSINT Toolkit'}
    response = requests.get(url=url, headers=headers)
    response_json = json.loads(response.text)
    return response_json
'''

# ===========================================================================
# Hashes
# ===========================================================================


def malwarebazaar_hash_check(hash: str, proxies: dict):
    url = "https://mb-api.abuse.ch/api/v1/"
    data = {
        'query': 'get_info',
        'hash': hash
    }
    response = requests.post(url=url,
                             data=data,
                             proxies=proxies)
    response_json = json.loads(response.text)
    if response.status_code == 200:
        response_json = json.loads(response.text)
        return response_json
    else:
        return {"error": response.status_code}


# ===========================================================================
# Universal
# ===========================================================================
def check_shodan(ioc: str, method: str, apikey: str, proxies: dict):
    apikey = apikey
    url = "https://api.shodan.io"
    endpoint = {'ip': '/shodan/host/',  # IP information
                'domain': '/dns/domain/'  # Subdomains and DNS entrys per Domain
                }

    if method == 'ip':
        response = requests.get(url=url + endpoint[method] + ioc + '?key=' + apikey,
                                proxies=proxies)
        response_json = json.loads(response.text)
        if response.status_code == 200:
            response_json = json.loads(response.text)
            return response_json
        elif response.status_code == 404 and response_json['error'] == 'No information available for that IP.':
            return response_json
        else:
            return {"shodan_error": response.status_code}
    elif method == 'domain':
        response = requests.get(url=url + endpoint[method] + ioc + '?key=' + apikey,
                                proxies=proxies)
        response_json = json.loads(response.text)
        if response.status_code == 200:
            response_json = json.loads(response.text)
            return response_json
        else:
            return {"shodan_error": response.status_code}


# ===========================================================================
# Social media
# ===========================================================================
def search_twitter(ioc: str, bearer: str):
    import tweepy as tw
    import unicodedata

    twitter_bearer_token = bearer
    client = tw.Client(bearer_token=twitter_bearer_token)

    # Define search query and exclude retweets
    query = f'{ioc} -is:retweet'

    # get tweets from API
    tweets = client.search_recent_tweets(
        query=query,
        tweet_fields=['context_annotations',
                      'created_at', 'author_id', 'public_metrics'],
        max_results=15
    )

    results = []
    if tweets.data:
        results.append({'count': len(tweets.data)})
        for tweet in tweets.data:
            author = client.get_user(id=tweet.author_id)  # find username by id
            author = unicodedata.normalize('NFKD', str(
                author.data.username)).encode('ascii', 'ignore')
            created_at = unicodedata.normalize('NFKD', str(
                tweet.created_at)).encode('ascii', 'ignore')
            text = unicodedata.normalize('NFKD', str(
                tweet.text)).encode('ascii', 'ignore')
            results.append({'author': author,
                            'created_at': created_at,
                            'text': text})
        return results
    else:
        return [{'count': 0}]


def search_reddit(ioc: str, client_secret: str, client_id: str):
    headers = {"User-Agent": "OSINT Toolkit 0.1"}
    result = []
    params = {
        "q": ioc,
        "sort": "new",
        "limit": 25,
        "syntax": "plain",
        "t": "all"
    }
    url = f"https://www.reddit.com/search.json"
    response = requests.get(url, headers=headers,
                            params=params, auth=(client_id, client_secret))

    if response.ok:
        data = response.json()
        for post in data["data"]["children"]:
            post_data = post["data"]
            result.append({
                "id": str(post_data["id"]),
                "author": str(post_data["author"]),
                "created_utc": str(datetime.fromtimestamp(int(post_data["created_utc"])).strftime('%Y-%m-%d %H:%M:%S')),
                "title": str(post_data["title"]),
                "message": str(post_data['selftext']),
                "score": str(post_data["score"]),
                "url": str(post_data["url"])
            })
    match response.status_code:
        case 401: result = {"error": 401}
        case 429: result = {"error": 429}
    return result


# API is not useful atm. Only allows to search for own toots
def mastodon(keyword: str):
    url = f"https://ioc.exchange/api/v2/search?q={keyword}"
    response = requests.get(url=url)

    if response.status_code == 200:
        response_json = json.loads(response.text)["statuses"]
        return response_json
    else:
        return {"error": response.status_code}


# ===========================================================================
# CVEs
# ===========================================================================
def search_nist_nvd(cve: str, api_key: str, proxies: dict):
    headers = {
        "apiKey": api_key
    }
    pattern = r"^CVE-\d{4}-\d{4,}$"
    match_cve = re.match(pattern, cve)
    if match_cve:
        url = f"https://services.nvd.nist.gov/rest/json/cves/2.0?cveId={cve}"
        response = requests.get(url=url,
                                headers=headers,
                                proxies=proxies)
        response_json = json.loads(response.text)
        if response.status_code == 200:
            response_json = json.loads(response.text)
            return response_json
        else:
            return {"error": response.status_code}
    else:
        response_json = {'error': 'Invalid input '}
    return response_json


# ===========================================================================
# Other
# ===========================================================================
def search_github(ioc: str, access_token: str):
    headers = {
        'Authorization': f'Token {access_token}'
    }
    url = f'https://api.github.com/search/code?q={ioc}'
    response = requests.get(url=url, headers=headers)
    if response.status_code == 200:
        response_json = response.json()
        return response_json
    else:
        return {'error': response.status_code}
