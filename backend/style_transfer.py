import torch
from torchvision import transforms
from PIL import Image
from transformer_net import TransformerNet

# Check device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load original style models
style_models = {
    "candy": "models/candy.pth",  # Updated to use 'models' folder
    "mosaic": "models/mosaic.pth",
    "rain_princess": "models/rain_princess.pth",
    "udnie": "models/udnie.pth",
}

# Load TransformerNet models
for style, model_path in style_models.items():
    model = TransformerNet().to(device).eval()
    state_dict = torch.load(model_path, map_location=device)
    # Remove unexpected running stats if present
    for key in list(state_dict.keys()):
        if key.endswith("running_mean") or key.endswith("running_var"):
            del state_dict[key]
    model.load_state_dict(state_dict)
    style_models[style] = model

# Preprocessing and postprocessing
preprocess = transforms.Compose([
    transforms.Resize((512, 512)),
    transforms.ToTensor(),
    transforms.Lambda(lambda x: x * 255),  # Match model input
])

postprocess = transforms.Compose([
    transforms.Lambda(lambda x: x.clamp(0, 255) / 255),  # Ensure pixel values are valid
    transforms.ToPILImage()
])

def apply_style_transfer(content_image: Image.Image, style: str, intensity: int) -> Image.Image:
    """
    Applies a selected style transfer to the content image.
    """
    if style not in style_models:
        raise ValueError(f"Style '{style}' not available")
    model = style_models[style]
    content_tensor = preprocess(content_image).unsqueeze(0).to(device)
    with torch.no_grad():
        styled_tensor = model(content_tensor)
        print(f"Styled Tensor: Min={styled_tensor.min()}, Max={styled_tensor.max()}, Mean={styled_tensor.mean()}")

    # Adjust style intensity
    styled_tensor = content_tensor * (1 - intensity / 100) + styled_tensor * (intensity / 100)
    styled_image = postprocess(styled_tensor.squeeze().cpu())
    return styled_image
