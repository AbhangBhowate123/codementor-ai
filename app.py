import os
import sys
import uuid
import traceback

# ── Windows asyncio fix — MUST happen before cognee/services are imported ────
if sys.platform == "win32":
    import asyncio
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Import AFTER the event loop policy is set and .env is loaded
from services.tutor import generate_tutor_reply
from services.memory import recall_memory

GROQ_KEY   = os.environ.get("GROQ_API_KEY", "")
COGNEE_KEY = os.environ.get("COGNEE_API_KEY", "")

print("✅ Groq key loaded:  ", bool(GROQ_KEY))
print("✅ Cognee key loaded:", bool(COGNEE_KEY))


@app.route("/health")
def health():
    return jsonify({
        "flask":  "✅ running",
        "groq":   bool(GROQ_KEY),
        "cognee": bool(COGNEE_KEY),
    })


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data    = request.get_json(force=True, silent=True) or {}
        message = (data.get("message") or "").strip()

        # Accept either key name — works with any version of the frontend
        session_id = data.get("session_id") or data.get("user_id")
        if not session_id:
            session_id = uuid.uuid4().hex[:12]

        if not message:
            return jsonify({"reply": "Please send a message!", "session_id": session_id})

        result = generate_tutor_reply(message, session_id)
        return jsonify(result)

    except Exception as e:
        print("❌ CHAT ERROR:\n", traceback.format_exc())
        return jsonify({"reply": f"❌ Error: {str(e)}"}), 500


@app.route("/memory/<session_id>")
def memory(session_id):
    try:
        memories = recall_memory(
            "topics studied and weak areas",
            session_id=session_id,
            only_context=True,
            top_k=10,
        )
        return jsonify({"memory": memories})
    except Exception as e:
        return jsonify({"memory": [], "error": str(e)})


if __name__ == "__main__":
    print("\n🚀 http://localhost:5000")
    print("   Groq   → tutor replies (fast)")
    print("   Cognee → memory + knowledge graph (background)\n")
    app.run(debug=False, host="0.0.0.0", port=5000)
