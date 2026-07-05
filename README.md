# CodeMentor AI — Coding Interview Tutor with Cognee Memory

An AI-powered coding interview tutor that remembers you across every session 
using Cognee's knowledge graph memory.

## The Problem
Every AI tutor today has amnesia — ChatGPT forgets you the moment you close the tab.

## The Solution
CodeMentor AI uses Cognee to build a persistent knowledge graph of your 
learning history — tracking weak areas, mastered topics, and study patterns 
across infinite sessions.

## How Cognee Powers It
- `cognee.remember()` — saves every interaction to the knowledge graph
- `cognee.recall()` — retrieves personalized context before each reply  
- `cognee.improve()` — rebuilds the graph every 3 sessions, getting smarter

## Tech Stack
- Frontend: Next.js (React)
- Backend: Python Flask
- Memory: Cognee 1.2.2 (knowledge graph)
- LLM: Groq (llama-3.1-8b-instant)

## Setup
1. Clone the repo
2. Add GROQ_API_KEY and COGNEE_API_KEY to .env
3. Run run.bat

## Demo
[Live Demo Link] | [Demo Video Link]
