import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Use environment variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/login`, // ✅ Use environment variable
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      console.log("Server response:", data);

      if (data.success) {
        alert("Login Successful");

        localStorage.setItem("user", JSON.stringify(data.user));

        if (username.trim() === "admin" && password.trim() === "admin") {
          navigate("/admin");
        } else {
          navigate("/reserve");
        }
      } else {
        alert("Login Failed: Invalid credentials");
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login Failed");
      setUsername("");
      setPassword("");
    }
  };

  useEffect(() => {
    console.log("API URL:", API_URL); // ✅ Debug log
  }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        `}
      </style>
      <div
        className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md"
        style={{ fontFamily: "Kanit, sans-serif" }}
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleLogin} className="mt-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;