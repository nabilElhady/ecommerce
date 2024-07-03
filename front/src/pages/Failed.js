import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Failed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <h1 className="text-5xl font-bold text-red-800 mb-4">Purchase Failed</h1>
      <p className="text-lg text-red-600 mb-8">
        Something went wrong with your purchase. Please try again.
      </p>
      <p className="text-md text-red-600">
        You will be redirected to the home page shortly...
      </p>
    </div>
  );
};

export default Failed;
