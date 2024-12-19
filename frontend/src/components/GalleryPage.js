import React from "react";
import "./GalleryPage.css";

function GalleryPage({ gallery, setGallery }) {
  const handleDownload = (image) => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "styled_image.jpg";
    link.click();
  };

  const handleRemove = (index) => {
    setGallery((prevGallery) => prevGallery.filter((_, i) => i !== index));
  };

  return (
    <main className="gallery-page">
      <h2 className="gallery-title">Gallery</h2>
      {gallery.length === 0 ? (
        <p className="empty-gallery">No images in the gallery yet. Start styling!</p>
      ) : (
        <div className="gallery-grid">
          {gallery.map((img, index) => (
            <div key={index} className="gallery-item">
              <img src={img} alt={`Styled ${index}`} className="gallery-image" />
              <div className="gallery-actions">
                <button className="gallery-btn" onClick={() => handleDownload(img)}>
                  Download
                </button>
                <button className="gallery-btn" onClick={() => handleRemove(index)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default GalleryPage;
