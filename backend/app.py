from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image, ImageOps
import io

app = Flask(__name__)
CORS(app)

@app.route('/apply-style', methods=['POST'])
def apply_style():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    # Get style intensity
    style_intensity = int(request.form.get('style_intensity', 50))

    # Read and process the image
    image = request.files['image']
    image = Image.open(io.BytesIO(image.read())).convert('RGB')

    # Dummy style transformation (e.g., grayscale with intensity scaling)
    styled_image = ImageOps.grayscale(image).convert('RGB')
    styled_image = styled_image.point(lambda p: p * (style_intensity / 100))

    # Save the processed image to a buffer
    buffer = io.BytesIO()
    styled_image.save(buffer, format="JPEG")
    buffer.seek(0)

    return send_file(buffer, mimetype='image/jpeg')

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'An internal server error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True)
