import React, { useState } from "react";
import Navbar from "../Navbar/HomeNavbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import client from "../../api/client";

toast.configure();
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const register = (e) => {
    e.preventDefault();
    client
      .post("/auth/register", { email, password, username, phone })
      .then(() => {
        toast.success("Signup successful", { position: toast.POSITION.TOP_RIGHT });
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Signup error", {
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
        <form onSubmit={(e) => register(e)}>
          <div className="title">Signup</div>
          <div className="input-box underline">
            <label htmlFor="Email">Email</label>
            <input type="text" placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} required />
            <div className="underline"></div>
          </div>
          <div className="input-box">
            <label htmlFor="password">Create Password</label>
            <input type="password" placeholder="Enter Your Password" onChange={(e) => setPassword(e.target.value)} required />
            <div className="underline"></div>
          </div>
          <div className="input-box">
            <label htmlFor="username">User Name</label>
            <input type="text" placeholder="Enter Your Username" onChange={(e) => setUsername(e.target.value)} required />
            <div className="underline"></div>
          </div>
          <div className="input-box">
            <label htmlFor="phone">Phone</label>
            <input type="text" placeholder="Enter Your Phone" onChange={(e) => setPhone(e.target.value)} required />
            <div className="underline"></div>
          </div>
          <div className="input-box button">
            <input type="submit" name="" value="Continue" />
          </div>
        </form>
      </div>
    </div>
  );
};
export default Signup;
