import React, { useState } from "react";
import UserManagement from "../extras/userManagment";
import ProductManagement from "../extras/productManagment";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="bg-gray-800 text-white w-full md:w-64 space-y-6 py-7 px-2">
        <div className="text-white text-3xl font-semibold text-center">
          Admin Dashboard
        </div>
        <nav>
          <button
            onClick={() => setActiveTab("users")}
            className={`block w-full text-left py-2.5 px-4 rounded transition duration-200 ${
              activeTab === "users" ? "bg-gray-600" : "hover:bg-gray-700"
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`block w-full text-left py-2.5 px-4 rounded transition duration-200 ${
              activeTab === "products" ? "bg-gray-600" : "hover:bg-gray-700"
            }`}
          >
            Products
          </button>
        </nav>
      </div>
      <div className="flex-grow p-6 bg-gray-100 overflow-auto">
        {activeTab === "users" && <UserManagement />}
        {activeTab === "products" && <ProductManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
