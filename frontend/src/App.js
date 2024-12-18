import React, { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://127.0.0.1:5000/apply-style", formData, {
        responseType: "blob",
      });
      setResult(URL.createObjectURL(response.data));
    } catch (error) {
      console.error("Error applying style:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Interactive Style Transfer</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br />
      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        Apply Style
      </button>
      {result && (
        <div style={{ marginTop: "30px" }}>
          <h2>Styled Image:</h2>
          <img src={result} alt="Styled result" style={{ maxWidth: "100%", maxHeight: "500px" }} />
        </div>
      )}
    </div>
  );
}

export default App;
