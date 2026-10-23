from backend.models.wiki_client import wiki


def verify_topic(topic: str):

    try:
        page = wiki.page(topic)

        if not page.exists():
            return {
                "topic": topic,
                "verified": False,
                "summary": "",
                "source": "Wikipedia",
                "url": None
            }

        sentences = page.summary.split(". ")
        summary = ". ".join(sentences[:3])

        return {
            "topic": topic,
            "verified": True,
            "summary": summary,
            "source": "Wikipedia",
            "url": page.fullurl
        }

    except Exception:
        return {
            "topic": topic,
            "verified": False,
            "summary": "",
            "source": "Wikipedia",
            "url": None
        }