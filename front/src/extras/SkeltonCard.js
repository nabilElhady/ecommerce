import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="block">
        <div className="w-full h-48 bg-gray-300"></div>
      </div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 mb-2"></div>
        <div className="h-4 bg-gray-300 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-300 w-1/4"></div>
          <div className="h-8 bg-yellow-300 w-1/4 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
