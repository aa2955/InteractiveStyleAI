import React, { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [styleIntensity, setStyleIntensity] = useState(50);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setResult(null); // Reset the result when a new image is selected
  };

  const handleStyleChange = (e) => {
    setStyleIntensity(e.target.value);
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("style_intensity", styleIntensity);

    setLoading(true); // Start loading
    try {
      const response = await axios.post("http://127.0.0.1:5000/apply-style", formData, {
        responseType: "blob",
      });
      const styledImageURL = URL.createObjectURL(response.data);
      setResult(styledImageURL);
      setGallery((prevGallery) => [...prevGallery, styledImageURL]); // Add to gallery
    } catch (error) {
      console.error("Error applying style:", error.response?.data || error.message);
      alert("Something went wrong on the server. Please try again.");
    }
    setLoading(false); // Stop loading
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Interactive Style Transfer</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <div style={{ marginTop: "20px" }}>
        <label>Style Intensity: {styleIntensity}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={styleIntensity}
          onChange={handleStyleChange}
          style={{ marginLeft: "10px" }}
        />
      </div>
      <br />
      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        Apply Style
      </button>
      <button onClick={handleReset} style={{ marginTop: "20px", marginLeft: "10px" }}>
        Reset
      </button>
      {loading && <p>Processing your image... Please wait.</p>}
      {result && (
        <div style={{ marginTop: "30px" }}>
          <h2>Styled Image:</h2>
          <img src={result} alt="Styled result" style={{ maxWidth: "100%", maxHeight: "500px" }} />
          <br />
          <a href={result} download="styled_image.jpg" style={{ marginTop: "10px", display: "inline-block" }}>
            <button>Download Image</button>
          </a>
        </div>
      )}
      {gallery.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Gallery</h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            {gallery.map((img, index) => (
              <div key={index} style={{ margin: "10px", position: "relative" }}>
                <img
                  src={img}
                  alt={`Styled ${index}`}
                  style={{ width: "150px", height: "150px", objectFit: "cover", cursor: "pointer" }}
                  onClick={() => window.open(img, "_blank")}
                />
                <button
                  onClick={() =>
                    setGallery((prevGallery) =>
                      prevGallery.filter((_, i) => i !== index)
                    )
                  }
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
