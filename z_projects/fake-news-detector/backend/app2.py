from flask import Flask, request, jsonify
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, pipeline
import requests
import sqlite3
import hashlib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Define MODEL_DIR with explicit local path
MODEL_DIR = 'backend/models'  # Path to the trained model files

# Load tokenizer and model with local_files_only to avoid Hugging Face lookup
try:
    tokenizer = DistilBertTokenizer.from_pretrained(MODEL_DIR, local_files_only=True)
    model = DistilBertForSequenceClassification.from_pretrained(MODEL_DIR, local_files_only=True)
    classifier = pipeline('text-classification', model=model, tokenizer=tokenizer)
except Exception as e:
    print(f"Error loading model: {e}")
    raise

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect('cache.db')
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS results (text_hash TEXT PRIMARY KEY, score REAL, details TEXT)')
    conn.commit()
    conn.close()

init_db()

# Cache analysis results
def cache_result(text, score, details):
    text_hash = hashlib.md5(text.encode()).hexdigest()
    conn = sqlite3.connect('cache.db')
    c = conn.cursor()
    c.execute('INSERT OR REPLACE INTO results VALUES (?, ?, ?)', (text_hash, score, details))
    conn.commit()
    conn.close()

def get_cached_result(text):
    text_hash = hashlib.md5(text.encode()).hexdigest()
    conn = sqlite3.connect('cache.db')
    c = conn.cursor()
    c.execute('SELECT score, details FROM results WHERE text_hash = ?', (text_hash,))
    result = c.fetchone()
    conn.close()
    return result if result else None

@app.route('/')
def home():
    return "Fake News Detector Backend Running", 200  # Test route

@app.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.json
    text = data.get('text', '')[:2000]
    source = data.get('source', '')

    # Check cache
    cached = get_cached_result(text)
    if cached:
        return jsonify({'score': cached[0], 'details': cached[1]})

    # NLP analysis
    try:
        result = classifier(text)
        score = result[0]['score'] if result[0]['label'] == 'LABEL_1' else 1 - result[0]['score']  # LABEL_1 = Real
    except Exception as e:
        score = 0.5
        print(f'NLP Error: {e}')

    # Source credibility check
    credibility = 'Unknown'
    try:
        if source:
            api_key = 'YOUR_NEWSAPI_KEY'  # Replace with your key
            response = requests.get(f'https://newsapi.org/v2/everything?domains={source}&apiKey={api_key}', timeout=5)
            if response.status_code == 200:
                source_data = response.json()
                credibility = 'High' if source_data.get('articles') else 'Low'
    except Exception as e:
        print(f'NewsAPI Error: {e}')

    details = f'Credibility: {credibility}, Prediction: {"Real" if score > 0.5 else "Fake"}'
    cache_result(text, score, details)
    
    return jsonify({'score': score, 'details': details})

if __name__ == '__main__':
    app.run(debug=True, port=5000)