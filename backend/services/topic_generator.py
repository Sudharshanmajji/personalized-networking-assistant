from backend.models.gpt2 import generator


FALLBACK_QUESTIONS = {
    "Artificial Intelligence":
        "How are you seeing AI change the way teams solve real-world problems?",

    "Machine Learning":
        "What machine-learning applications are creating the most practical value in your work?",

    "Data Science":
        "What data challenges are you finding most difficult when applying analytics in real projects?",

    "Cyber Security":
        "What cybersecurity challenges are organizations prioritizing as technology becomes more connected?",

    "Cloud Computing":
        "How is your organization approaching cloud adoption, and what challenges have you encountered?",

    "Software Development":
        "What development practices are helping your team build and deliver software more effectively?",

    "Blockchain":
        "What practical blockchain applications do you think have the most potential in your industry?",

    "Healthcare":
        "How do you see technology changing the way healthcare organizations solve current challenges?",

    "Networking":
        "What brought you to this event, and which technology topic are you most interested in?",

    "Innovation":
        "What technology innovations are you seeing make the biggest impact in your industry?",

    "Leadership":
        "What leadership challenges are becoming more important as technology teams evolve?",

    "Education":
        "How is technology changing the way people learn and develop professional skills?",

    "Entrepreneurship":
        "What opportunities do you see for technology startups in this area?",

    "Research":
        "What recent research developments in this field do you find particularly interesting?",

    "Technology":
        "What technology trends are having the biggest impact on your work?"
}


def get_fallback_question(interest, themes):
    """
    Select a professional networking question based on
    the user's interest or the strongest detected event theme.
    """

    # First try the user's exact interest
    if interest in FALLBACK_QUESTIONS:
        return FALLBACK_QUESTIONS[interest]

    # Otherwise use the strongest detected theme
    for theme in themes:
        label = theme["label"]

        if label in FALLBACK_QUESTIONS:
            return FALLBACK_QUESTIONS[label]

    # Generic fallback
    return (
        f"What developments in {interest} "
        f"are you most interested in at this event?"
    )


def is_bad_generation(text, interest):
    """
    Basic quality check for GPT-2 output.
    """

    if not text:
        return True

    words = text.split()

    # Too short or excessively long
    if len(words) < 10 or len(words) > 35:
        return True

    # Obvious unwanted content
    bad_patterns = [
        "http://",
        "https://",
        "www.",
        "4shared",
        ".com/",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
        "2025",
        "2026",
    ]

    text_lower = text.lower()

    for pattern in bad_patterns:
        if pattern.lower() in text_lower:
            return True

    # The generated text should at least mention the user's interest
    # or one of its important words.
    interest_words = [
        word.lower()
        for word in interest.split()
        if len(word) > 3
    ]

    if interest_words:
        if not any(word in text_lower for word in interest_words):
            return True

    return False


def generate_conversation(
    event_description,
    interest,
    themes,
    summary
):
    """
    Generate a networking conversation starter using GPT-2.
    If GPT-2 produces unsuitable text, return a reliable
    context-aware professional question.
    """

    theme_text = ", ".join(
        theme["label"] for theme in themes[:5]
    )

    prompt = f"""
You are a professional networking assistant.

Event:
{event_description}

User interest:
{interest}

Detected themes:
{theme_text}

Verified context:
{summary}

Write ONE professional networking question that a person
could ask another professional at this event.

The question must:
- be relevant to the user's interest
- relate to the event
- be natural and professional
- contain only one question
- be between 10 and 30 words
- contain no URLs or unrelated information

Question:
"""

    try:
        result = generator(
            prompt,
            max_new_tokens=50,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            repetition_penalty=1.3,
            no_repeat_ngram_size=3
        )

        generated_text = result[0]["generated_text"]

        conversation = generated_text[len(prompt):].strip()

        # Remove common unwanted prefixes
        prefixes = [
            "Question:",
            "Conversation starter:",
            "Answer:"
        ]

        for prefix in prefixes:
            if conversation.startswith(prefix):
                conversation = conversation[len(prefix):].strip()

        # Keep only the first sentence/question
        for separator in ["?", ".", "!"]:
            if separator in conversation:
                conversation = (
                    conversation.split(separator)[0] + separator
                )
                break

        # Validate GPT-2 output
        if not is_bad_generation(conversation, interest):
            return conversation

    except Exception:
        pass

    # Reliable application fallback
    return get_fallback_question(
        interest,
        themes
    )