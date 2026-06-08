import React, { useState } from "react";
import Navbar from "../Navbar/HomeNavbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import client from "../../api/client";
import "../Style/Login.css";

toast.configure();
const Login = () => {
  const [email, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();
    client
      .post("/auth/login", { email, password })
      .then((response) => {
        // Persist the JWT so the axios interceptor attaches it to later requests.
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.email);
        toast.success("Login successful", { position: toast.POSITION.TOP_RIGHT });
        navigate("/question");
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Login error", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  return (
    <div className="section-body">
      <div>
        <Navbar />
      </div>
      <div className="container">
        <form onSubmit={(e) => login(e)}>
          <div className="title">Login</div>
          <div className="input-box underline">
            <label>Email</label>
            <input
              type="text"
              placeholder="Enter Your Email"
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-box button">
            <input type="submit" name="" value="Continue" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
