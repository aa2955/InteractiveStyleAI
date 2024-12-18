from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

@app.route('/apply-style', methods=['POST'])
def apply_style():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image = request.files['image']
    image = Image.open(io.BytesIO(image.read())).convert('RGB')

    # Placeholder for style transfer logic
    styled_image = image  # Dummy placeholder

    return jsonify({'message': 'Style applied successfully'})

if __name__ == '__main__':
    app.run(debug=True)
