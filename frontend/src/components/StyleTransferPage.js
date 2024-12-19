import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StyleTransferPage.css";

function StyleTransferPage({ gallery, setGallery }) {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState("candy");
  const [availableStyles, setAvailableStyles] = useState([]);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/available-styles");
        setAvailableStyles(response.data.available_styles);
        setStyle(response.data.available_styles[0] || "candy");
      } catch (error) {
        console.error("Error fetching styles:", error);
      }
    };
    fetchStyles();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }
    const formData = new FormData();
    formData.append("image", image);
    formData.append("style", style);
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/apply-style", formData, {
        responseType: "blob",
      });
      const styledImageURL = URL.createObjectURL(response.data);
      setResult(styledImageURL);
      setGallery([...gallery, styledImageURL]);
    } catch (error) {
      console.error("Error applying style:", error);
      alert("Failed to apply style. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="style-transfer-page">
      <div className="content-wrapper">
        <div className="intro-section">
          <h2 className="page-title">Transform Your Photos with Style</h2>
          <p className="page-description">
            Upload your image, choose a style, and let us create an artistic masterpiece.
          </p>
        </div>

        <div className="upload-section">
          <div className="upload-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="style-dropdown"
            >
              {availableStyles.map((styleOption, index) => (
                <option key={index} value={styleOption}>
                  {styleOption.charAt(0).toUpperCase() + styleOption.slice(1)}
                </option>
              ))}
            </select>
            <button className="apply-btn" onClick={handleSubmit}>
              Apply Style
            </button>
          </div>
        </div>

        {loading && <p className="loading-text">Processing... Please wait.</p>}

        {result && (
          <div className="result-section">
            <h3>Your Styled Image</h3>
            <img src={result} alt="Styled result" className="result-image" />
          </div>
        )}
      </div>
    </main>
  );
}

export default StyleTransferPage;
