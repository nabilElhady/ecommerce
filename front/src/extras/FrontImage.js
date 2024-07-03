import React, { useState } from "react";
import FrontImageSrc1 from "./images/pexels-goumbik-1420702.jpg";

const images = [FrontImageSrc1, FrontImageSrc1, FrontImageSrc1];

const FrontImage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeState, setFadeState] = useState("fade-in");

  const handleImageChange = (index) => {
    setFadeState("fade-out");
    setTimeout(() => {
      setCurrentImageIndex(index);
      setFadeState("fade-in");
    }, 500);
  };

  const nextImage = () => {
    handleImageChange((currentImageIndex + 1) % images.length);
  };

  const prevImage = () => {
    handleImageChange((currentImageIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden z-0">
      {" "}
      {/* Ensure z-index is lower than the search results */}
      <img
        src={images[currentImageIndex]}
        className={`h-full w-full object-cover blur-sm transition-opacity duration-500 ${fadeState}`}
        alt="Front"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
        <h1 className="text-8xl font-bold text-white mb-4 outline-text">
          Commercial
        </h1>
        <p className="text-4xl font-semibold text-white outline-text">
          Get your discount!
        </p>
      </div>
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-black px-4 py-2 rounded-lg z-10" /* Ensure this button is above the image */
      >
        Prev
      </button>
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-black px-4 py-2 rounded-lg z-10" /* Ensure this button is above the image */
      >
        Next
      </button>
    </div>
  );
};

export default FrontImage;
