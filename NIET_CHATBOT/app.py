from flask import Flask, request, jsonify
from routes.chat_routes import process_chat
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Backend is running fine ✅"})



@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "")
    response = process_chat(user_input)
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, port=5023)
