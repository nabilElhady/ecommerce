import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [state, setState] = useState(true);
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["user"]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      let response;
      if (state) {
        formData.name = e.target.username.value;
        formData.confirmPassword = e.target.confirmPassword.value;

        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match!");
          return;
        }

        response = await axios.post(
          "https://ecommerce-backend-wine-one.vercel.app/api/v1/users/signup",
          formData
        );
        setState(!state);
        toast.success("Signup successful! Please log in.");
      } else {
        response = await axios.post(
          "https://ecommerce-backend-wine-one.vercel.app/api/v1/users/login",
          formData
        );
        toast.success("Logged in successfully! Welcome.");
      }

      const { token, user } = response.data;

      setCookie("user", user, { path: "/" });
      setCookie("token", token, { path: "/" });

      dispatch(
        setLogin({
          user: response.data.user,
          token: response.data.token,
        })
      );
      if (user.isAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">
          {state ? "Sign Up" : "Log in"}
        </h2>
        <form onSubmit={handleSubmit}>
          {state && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="text-black w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your username"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="text-black w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="text-black w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>
          {state && (
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="text-black w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-yellow-200 text-black px-4 py-2 rounded font-bold text-lg hover:bg-yellow-400 transition-colors duration-300 w-full"
            >
              {state ? "Sign Up" : "Sign In"}
            </button>
          </div>
          <div className="text-black mt-4">
            {state ? (
              <>
                If you have an account{" "}
                <span
                  onClick={() => setState(!state)}
                  className="cursor-pointer text-blue-600 underline"
                >
                  sign in
                </span>
              </>
            ) : (
              <>
                If you don't have an account{" "}
                <span
                  onClick={() => setState(!state)}
                  className="cursor-pointer text-blue-600 underline"
                >
                  sign up
                </span>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
