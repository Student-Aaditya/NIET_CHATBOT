import json
import os
import difflib

# === Load training questions ===
DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/niet_training_questions.json")

with open(DATA_PATH, "r", encoding="utf-8") as f:
    TRAINING_DATA = json.load(f)

def detect_intent(user_input: str) -> str:
    """
    Detects the most likely intent based on question similarity.
    Uses fuzzy string matching to compare user input with known questions.
    """
    user_input = user_input.lower().strip()
    best_match = None
    highest_score = 0
    best_intent = "general_query"

    for item in TRAINING_DATA:
        question = item["question"].lower()
        score = difflib.SequenceMatcher(None, user_input, question).ratio()
        if score > highest_score:
            highest_score = score
            best_match = question
            best_intent = item["intent"]

    # Debug log
    print(f"[IntentDetector] User Input: {user_input}")
    print(f"[IntentDetector] Best Match: {best_match} ({highest_score:.2f}) => Intent: {best_intent}")

    # If similarity is very low, fallback to general query
    if highest_score < 0.45:
        return "general_query"

    return best_intent
