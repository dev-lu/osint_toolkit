import json
import logging
from typing import Any, Dict, List, Optional, Generator

from sqlalchemy.orm import Session

from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnablePassthrough


from app.features.newsfeed.crud.newsfeed_crud import (
    get_recent_news_articles,
    get_news_article_by_id
)

from app.core.settings.api_keys.crud.api_keys_settings_crud import get_apikey
from app.core.settings.cti_profile.crud.cti_profile_settings_crud import get_cti_settings

logger = logging.getLogger(__name__)

# ----------------------------------------------------------------------
# PROMPTS
# ----------------------------------------------------------------------

RANKING_PROMPT = """
You are a very experienced cyber threat intelligence analyst specialized in analyzing large amounts of news articles for relevance.
Below is a list of news article headlines. For each headline, consider how relevant it is for cybersecurity and threat intelligence. 
News articles have a higher relevance, if there are more news article headlines about the same topic and / or if it describes about active threats or vulnerabilities.
Your task:
1. Identify the 10 most relevant articles from the list (if there are fewer than 10, select them all).
2. Make sure to not list multiple articles about the same topic.
3. Sort them by relevance (most relevant first).
4. Return the result in a JSON array of objects with the following fields:
   - id: the article ID
   - title: the article headline
   - relevance_score: 1 (most relevant) to 10 (least relevant within the top 10)
   - reason: a brief reason for ranking

Only return the JSON, no additional commentary.
List of articles:
<news article headlines>
{articles_list}
</news article headlines>
"""

ANALYSIS_PROMPT = """
You are a very experienced cyber threat intelligence analyst specialized in in creating best in class news article analysis. 
Below you will find news article data about a news artcicle.
You will receive the article's title, feed name, and summary text. 
Produce a comprehensive analysis in JSON format with the following fields:
{{
  "Risk": "[High / Medium / Low / Informational]",
  "Summary": "[Detailed summary of the article]",
  "Analysis comment": "[Reasoning why the article is relevant]",
  "Action items": ["list of actions"]
  "Source": "Complete url to the article"
}}

The criteria to determine the risk rating are:
<Risk Criteria>
High Risk - Immediate, active threats with high confidence—such as zero-day exploits or unpatched vulnerabilities—that require urgent action to protect critical systems. Severe threats with potential for significant impact where mitigations exist but may be underutilized, necessitating prompt response.
Medium Risk - Emerging vulnerabilities or attack trends that could impact operations under specific conditions, meriting careful monitoring.
Low Risk - Minor issues or outdated threats unlikely to affect core operations, generally limited in scope or impact.
Informational - Background or analytical content that provides context and insights without posing an immediate threat.
</Risk Criteria>

Keep it concise and to the point but not too short. Return only valid JSON.
Article data:
<news article data>
{article_data}
</news article data>
"""

def _create_llm(api_key: str) -> ChatOpenAI:
    """
    Returns a LangChain ChatOpenAI LLM configured with your chosen model, temperature, etc.
    NOTE: The warnings you see are due to an older version of LangChain.
          Upgrade your langchain package or update these class references if needed.
    """
    return ChatOpenAI(
        api_key=api_key,
        model_name="gpt-4o",
        temperature=0.7,
        max_tokens=15000,
    )


def rank_recent_articles(db: Session) -> Optional[List[Dict[str, Any]]]:
    recent_articles = get_recent_news_articles(db, time_filter="7d")
    if not recent_articles:
        logger.info("No recent articles found for ranking.")
        return []

    articles_str_list = [f"- (ID: {a['id']}) {a['title']}" for a in recent_articles]
    if not articles_str_list:
        logger.info("No article titles to process in rank_recent_articles.")
        return []

    articles_list_for_prompt = "\n".join(articles_str_list)

    openai_api_key_obj = get_apikey(name="openai", db=db)
    if not openai_api_key_obj:
        logger.error("OpenAI API key not found in DB for ranking.")
        return []

    openai_api_key = openai_api_key_obj.get("key")

    prompt = PromptTemplate(
        template=RANKING_PROMPT,
        input_variables=["articles_list"]
    )
    llm = _create_llm(openai_api_key)
    
    # Create chain using pipe syntax
    chain = prompt | llm | JsonOutputParser()
    
    try:
        ranking_response = chain.invoke({"articles_list": articles_list_for_prompt})
        return ranking_response[:10]  # Limit to 10 articles
    except Exception as e:
        logger.exception("Error during LLM call for ranking:")
        return []


def analyze_article(article_id: int, db: Session) -> Dict[str, Any]:
    article = get_news_article_by_id(db, article_id)
    if not article:
        return {
            "Relevance": "Unknown",
            "Summary": "",
            "full_text": "",
            "Analysis comment": f"Article with ID {article_id} not found.",
            "Action items": []
        }

    article_data = {
        "id": article.id,
        "title": article.title,
        "feedname": article.feedname,
        "summary": article.summary or "",
        "full_text": article.full_text or "",
        "date": str(article.date),
    }

    openai_api_key_obj = get_apikey(name="openai", db=db)
    if not openai_api_key_obj:
        logger.error("OpenAI API key not found for article analysis.")
        return {
            "Relevance": "Unknown",
            "Summary": "",
            "Analysis comment": "OpenAI API key missing.",
            "Action items": []
        }
    
    openai_api_key = openai_api_key_obj.get("key")

    prompt = PromptTemplate(
        template=ANALYSIS_PROMPT,
        input_variables=["article_data"]
    )
    llm = _create_llm(openai_api_key)
    
    # Create chain using pipe syntax
    chain = prompt | llm | JsonOutputParser()
    
    try:
        return chain.invoke({"article_data": json.dumps(article_data, indent=2)})
    except Exception as e:
        logger.exception(f"Error during LLM call for article {article_id} analysis:")
        return {
            "Relevance": "Unknown",
            "Summary": "",
            "Full Text": "",
            "Analysis comment": f"Exception: {e}",
            "Action items": []
        }


def analyze_and_rank_top_articles(db: Session) -> List[Dict[str, Any]]:
    """
    1) Rank top 10 articles.
    2) Analyze each to get final data structure.
    Returns a list of dicts:
    [
      {
        "article_id": X,
        "title": "...",
        "relevance_score": X,
        "reason_for_ranking": "...",
        "analysis": {
          "Relevance": "...",
          "Summary": "...",
          "Analysis comment": "...",
          "Action items": [...]
        }
      },
      ...
    ]
    """
    logger.info("Starting to rank and analyze the top articles.")
    top_articles_ranking = rank_recent_articles(db)
    if not top_articles_ranking:
        logger.info("No articles returned from rank_recent_articles.")
        return []

    logger.info(f"Ranked {len(top_articles_ranking)} articles. Beginning analysis.")

    results = []

    for article_info in top_articles_ranking:
        article_id = article_info.get("id")
        if article_id is None:
            logger.warning("Ranked article missing 'id' field; skipping.")
            continue

        analysis = analyze_article(article_id, db)
        logger.info(f"Analysis completed for article ID {article_id}.")

        result_entry = {
            "article_id": article_id,
            "title": article_info.get("title", ""),
            "relevance_score": article_info.get("relevance_score", 99),
            "reason_for_ranking": article_info.get("reason", ""),
            "analysis": analysis
        }
        results.append(result_entry)

    # Sort by ascending relevance_score
    results.sort(key=lambda x: x["relevance_score"])
    logger.info(f"All articles analyzed. Returning {len(results)} results.")
    return results


def analyze_top_articles_stream(db: Session) -> Generator[str, None, None]:
    """
    Generator function (for SSE or similar streaming) that:
    1) Yields the ranking results
    2) Yields each article's analysis result
    3) Yields a final "done" message
    """
    logger.info("Starting SSE stream for top articles ranking + analysis.")
    top_articles_ranking = rank_recent_articles(db)

    if not top_articles_ranking:
        yield json.dumps({
            "type": "ranking",
            "articles": [],
            "info": "No ranked articles found."
        })
        yield json.dumps({
            "type": "complete",
            "message": "All analysis done"
        })
        return

    yield json.dumps({
        "type": "ranking",
        "articles": top_articles_ranking
    })

    for article_info in top_articles_ranking:
        article_id = article_info.get("id")
        if article_id is None:
            logger.warning("Skipping article in SSE stream: missing ID.")
            continue

        analysis = analyze_article(article_id, db)
        result_entry = {
            "article_id": article_id,
            "title": article_info.get("title", ""),
            "relevance_score": article_info.get("relevance_score", 99),
            "reason_for_ranking": article_info.get("reason", ""),
            "analysis": analysis
        }

        yield json.dumps({
            "type": "analysis",
            "article_result": result_entry
        })

    yield json.dumps({
        "type": "complete",
        "message": "All analysis done"
    })
