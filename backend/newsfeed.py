import feedparser
from datetime import datetime
import time
import regex as re
from database import crud
from database.database import SessionLocal


def get_news():
    news = []
    feed_db = crud.get_newsfeed_settings(db=SessionLocal())
    feeds = [feed.to_dict() for feed in feed_db]
    
    for entry in feeds:
        if entry['enabled'] == True:
            try:
                feed = feedparser.parse(entry['url'])
                for post in feed.entries:
                    news.append({
                        'feedname': entry['name'],
                        'icon': entry['icon'],
                        'title': post.title,
                        'summary': re.compile(r'<[^>]+>').sub('', post.summary),  # Remove HTML tags
                        'date': time.strftime("%A, %B %d, %Y - %H:%M", post.published_parsed),  # Format date
                        'link': post.link
                        })
            except:
                pass
    # Sort news ascending by date
    news.sort(key = lambda x: datetime.strptime(x['date'], '%A, %B %d, %Y - %H:%M'), reverse=True)
    return news
