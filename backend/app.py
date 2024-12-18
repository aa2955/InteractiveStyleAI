from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import io
from style_transfer import apply_dummy_style

app = Flask(__name__)
CORS(app)

@app.route('/apply-style', methods=['POST'])
def apply_style():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    # Load the image from the request
    image = request.files['image']
    image = Image.open(io.BytesIO(image.read())).convert('RGB')

    # Apply the dummy style-transfer function
    styled_image = apply_dummy_style(image)

    # Save the transformed image to a BytesIO object
    buffer = io.BytesIO()
    styled_image.save(buffer, format="JPEG")
    buffer.seek(0)

    # Return the styled image as a response
    return send_file(buffer, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True)
