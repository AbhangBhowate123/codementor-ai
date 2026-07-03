import os
import threading

from groq import Groq

from services.memory import recall_memory, store_memory, improve_memory

TUTOR_SYSTEM_PROMPT = """You are an expert coding interview tutor. You help candidates prepare for
technical interviews covering algorithms, data structures, system design, and behavioral questions.

Guidelines:
- Ask clarifying questions before jumping to solutions when a problem is ambiguous.
- Prefer the Socratic method: guide the candidate with hints rather than giving full answers immediately.
- When reviewing code or approaches, discuss time/space complexity and edge cases.
- Reference the candidate's past topics and weak areas when relevant context is provided.
- Keep responses to 3-5 sentences unless the candidate explicitly asks for full code or a deep dive.
- End with exactly one follow-up question to keep the conversation moving.
"""

groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))

# Tracks messages per session so cognee.improve() runs in batches, not every message
_message_counts: dict[str, int] = {}


def _build_context_block(memories: list[dict]) -> str:
    if not memories:
        return "No prior memory available for this session."

    lines = []
    for index, memory in enumerate(memories, start=1):
        text = memory.get("text") or memory.get("answer") or memory.get("question") or ""
        if text:
            lines.append(f"{index}. {text}")
    return "\n".join(lines) if lines else "No prior memory available for this session."


def _background_save_and_improve(message: str, reply: str, session_id: str) -> None:
    """
    Saves the interaction to Cognee and periodically rebuilds the knowledge
    graph — all in a background thread so it NEVER delays the chat response.
    """
    def _job():
        try:
            store_memory(f"Candidate: {message}\nTutor: {reply}", session_id=session_id)
            print(f"✅ Cognee: saved interaction for {session_id}")
        except Exception as e:
            print(f"⚠️ Cognee store skipped: {e}")
            return

        _message_counts[session_id] = _message_counts.get(session_id, 0) + 1
        count = _message_counts[session_id]

        # Rebuild the knowledge graph every 3 messages, not every single one
        if count % 3 == 0:
            try:
                print(f"🧠 Cognee: building knowledge graph for {session_id}...")
                improve_memory(session_id=session_id, run_in_background=False)
                print(f"✅ Cognee: knowledge graph updated for {session_id}")
            except Exception as e:
                print(f"⚠️ Cognee improve skipped: {e}")

    threading.Thread(target=_job, daemon=True).start()


def generate_tutor_reply(message: str, session_id: str) -> dict:
    # ── Single combined recall call (time-boxed at 6s in memory.py) ──────────
    # Combines "context for this message" + "topics studied" into ONE network
    # round trip instead of two — this alone roughly halves recall latency.
    memories = recall_memory(
        f"Relevant context for: {message}. Also: topics this candidate has "
        f"studied so far and any weak areas identified.",
        session_id=session_id,
        only_context=True,
        top_k=6,
    )
    context_block = _build_context_block(memories)

    # ── Single Groq call for the reply — fast, reliable, no provider conflicts ─
    completion = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": TUTOR_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Relevant memory from past sessions:\n{context_block}\n\n"
                    f"Candidate message:\n{message}"
                ),
            },
        ],
        max_tokens=300,
        temperature=0.7,
        timeout=20,
    )
    reply = completion.choices[0].message.content or ""

    # ── Save + improve in the background — never blocks the HTTP response ────
    _background_save_and_improve(message, reply, session_id)

    return {
        "reply": reply,
        "session_id": session_id,
        "memory_used": memories,
    }
