import React from "react";
import { ClipLoader } from "react-spinners"; // Import the ClipLoader from react-spinners

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="text-center">
        <ClipLoader color="#ffffff" size={50} />{" "}
        {/* Use ClipLoader with color and size props */}
        <p className="text-white mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
