import gradio as gr
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, pipeline
import hashlib
import sqlite3
import os
import requests

MODEL_DIR = 'backend\models'  # Path to model files
DB_PATH = 'cache.db'

# Load model + tokenizer
tokenizer = DistilBertTokenizer.from_pretrained(MODEL_DIR, local_files_only=True)
model = DistilBertForSequenceClassification.from_pretrained(MODEL_DIR, local_files_only=True)
classifier = pipeline('text-classification', model=model, tokenizer=tokenizer)

# Init DB
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS results (text_hash TEXT PRIMARY KEY, score REAL, details TEXT)')
    conn.commit()
    conn.close()

init_db()

def get_cached_result(text):
    text_hash = hashlib.md5(text.encode()).hexdigest()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT score, details FROM results WHERE text_hash = ?', (text_hash,))
    result = c.fetchone()
    conn.close()
    return result

def cache_result(text, score, details):
    text_hash = hashlib.md5(text.encode()).hexdigest()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT OR REPLACE INTO results VALUES (?, ?, ?)', (text_hash, score, details))
    conn.commit()
    conn.close()

# Main prediction function
def analyze(text, source=""):
    text = text[:2000]
    cached = get_cached_result(text)
    if cached:
        return f"{cached[1]} (cached)", cached[0]

    try:
        result = classifier(text)
        score = result[0]['score'] if result[0]['label'] == 'LABEL_1' else 1 - result[0]['score']
    except Exception as e:
        score = 0.5
        print("Error:", e)

    # Optional: NewsAPI source credibility (disabled unless key is added)
    credibility = 'Unknown'
    if source:
        try:
            api_key = os.getenv('NEWS_API_KEY')  # Add secret in Hugging Face settings
            response = requests.get(f'https://newsapi.org/v2/everything?domains={source}&apiKey={api_key}', timeout=5)
            if response.status_code == 200:
                data = response.json()
                credibility = 'High' if data.get('articles') else 'Low'
        except:
            pass

    details = f"Credibility: {credibility}, Prediction: {'Real' if score > 0.5 else 'Fake'}"
    cache_result(text, score, details)
    return details, score

# Gradio Interface
demo = gr.Interface(
    fn=analyze,
    inputs=[
        gr.Textbox(label="News Text", lines=5),
        gr.Textbox(label="Source (domain only, optional)", placeholder="e.g. cnn.com")
    ],
    outputs=[
        gr.Textbox(label="Details"),
        gr.Slider(label="Confidence Score", minimum=0, maximum=1)
    ],
    title="Fake News Detector",
    description="Enter a news snippet and optional source to check if it's real or fake."
)

demo.launch()
