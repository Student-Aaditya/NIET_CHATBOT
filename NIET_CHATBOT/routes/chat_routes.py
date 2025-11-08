from services.intent_detector import detect_intent
from services.query_handler import fetch_data

def process_chat(user_input):
    intent = detect_intent(user_input)
    answer = fetch_data(intent, user_input.lower())

    return {
        "answer": answer,
        "predicted_intent": intent
    }
