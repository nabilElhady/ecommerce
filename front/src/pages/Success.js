import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-5xl font-bold text-green-800 mb-4">
        Purchase Successful!
      </h1>
      <p className="text-lg text-green-600 mb-8">
        Thank you for your purchase. Your order is being processed.
      </p>
      <p className="text-md text-green-600">
        You will be redirected to the home page shortly...
      </p>
    </div>
  );
};

export default Success;
