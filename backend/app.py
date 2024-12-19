from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import io
from style_transfer import apply_style_transfer

app = Flask(__name__)
CORS(app)

# Define available styles
AVAILABLE_STYLES = ["candy", "mosaic", "rain_princess", "udnie"]

@app.route('/apply-style', methods=['POST'])
def apply_style():
    """
    Endpoint to apply style transfer to an uploaded image.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    # Get style and intensity from the request
    style = request.form.get('style', 'candy')  # Default to 'candy'
    intensity = int(request.form.get('style_intensity', 50))

    # Validate style selection
    if style not in AVAILABLE_STYLES:
        return jsonify({'error': f"Invalid style '{style}'. Available styles: {', '.join(AVAILABLE_STYLES)}"}), 400

    # Load the image from the request
    image = request.files['image']
    try:
        image = Image.open(io.BytesIO(image.read())).convert('RGB')
    except Exception as e:
        return jsonify({'error': f'Invalid image format: {str(e)}'}), 400

    # Apply style transfer
    try:
        styled_image = apply_style_transfer(image, style, intensity)
    except Exception as e:
        return jsonify({'error': f'Failed to apply style transfer: {str(e)}'}), 500

    # Return the styled image as a response
    buffer = io.BytesIO()
    styled_image.save(buffer, format="JPEG")
    buffer.seek(0)
    return send_file(buffer, mimetype='image/jpeg')

@app.route('/available-styles', methods=['GET'])
def available_styles():
    """
    Endpoint to return the list of available styles.
    """
    return jsonify({"available_styles": AVAILABLE_STYLES})

if __name__ == '__main__':
    app.run(debug=True)
