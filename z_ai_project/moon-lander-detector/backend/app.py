from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests for local testing

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        image_url = data.get('image_url')
        if not image_url:
            return jsonify({'error': 'Image URL is required'}), 400

        # Mock detection for prototype
        detections = []
        if 'sample1' in image_url.lower():
            detections = [
                {'type': 'boulder', 'bbox': [100, 100, 200, 200]},
                {'type': 'landslide', 'bbox': [300, 150, 400, 250]}
            ]
        elif 'moon' in image_url.lower():
            detections = [{'type': 'boulder', 'bbox': [150, 120, 250, 220]}]

        return jsonify({'detections': detections})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)