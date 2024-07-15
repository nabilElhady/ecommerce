import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleChanges, setRoleChanges] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce-backend-wine-one.vercel.app/api/v1/users"
        );
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users. Please try again.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(
        `https://ecommerce-backend-wine-one.vercel.app/api/v1/users/${id}`
      );
      setUsers(users.filter((user) => user._id !== id));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Error deleting user. Please try again.");
      toast.error("Error deleting user.");
    }
  };

  const handleRoleChange = (id, newRole) => {
    const isAdmin = newRole === "admin";
    setRoleChanges((prev) => ({ ...prev, [id]: isAdmin }));
  };

  const applyRoleChange = async (id) => {
    if (roleChanges[id] === undefined) return;

    try {
      const response = await axios.patch(
        `https://ecommerce-backend-wine-one.vercel.app/api/v1/users/${id}`,
        { isAdmin: roleChanges[id] }
      );
      setUsers(users.map((user) => (user._id === id ? response.data : user)));
      setRoleChanges((prev) => {
        const newChanges = { ...prev };
        delete newChanges[id];
        return newChanges;
      });
      toast.success("Role updated successfully!");
    } catch (error) {
      console.error("Error updating user role:", error);
      setError("Error updating user role. Please try again.");
      toast.error("Error updating user role.");
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded p-6">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4 text-black">
        User Management
      </h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user._id} className="p-4 bg-gray-50 rounded shadow">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col items-center md:items-start">
                <div className="font-semibold text-black">{user.name}</div>
                <div className="text-gray-600">{user.email}</div>
              </div>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <div>
                  <select
                    value={
                      roleChanges[user._id] !== undefined
                        ? roleChanges[user._id]
                          ? "admin"
                          : "user"
                        : user.isAdmin
                        ? "admin"
                        : "user"
                    }
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="bg-white border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  onClick={() => applyRoleChange(user._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Apply
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-2 text-gray-700 text-center md:text-left">
              <div>Total Purchases: {user.totalPurchases || 0}</div>
              <div>Total Spent: ${user.totalSpent || 0}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
