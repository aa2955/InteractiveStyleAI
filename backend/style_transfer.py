from PIL import Image, ImageOps

def apply_dummy_style(image: Image.Image) -> Image.Image:
    """
    A placeholder style-transfer function that converts the image to grayscale.
    Replace this with the actual style-transfer model logic later.
    """
    # Convert the image to grayscale as a dummy transformation
    styled_image = ImageOps.grayscale(image)
    return styled_image
