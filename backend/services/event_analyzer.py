from backend.models.distilbert import classifier


CANDIDATE_LABELS = [
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Cyber Security",
    "Cloud Computing",
    "Software Development",
    "Blockchain",
    "Healthcare",
    "Finance",
    "Business",
    "Marketing",
    "Entrepreneurship",
    "Education",
    "Networking",
    "Innovation",
    "Research",
    "Technology",
    "Startups",
    "Leadership",
    "Career Development",
]


def analyze_event(event_description: str):
    result = classifier(
        event_description,
        candidate_labels=CANDIDATE_LABELS,
        multi_label=True
    )

    themes = []

    for label, score in zip(result["labels"], result["scores"]):
        if score >= 0.30:
            themes.append({
                "label": label,
                "score": round(float(score), 2)
            })

    return themes