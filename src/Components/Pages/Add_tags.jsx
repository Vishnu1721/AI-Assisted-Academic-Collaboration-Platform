import React, { useState } from "react";
import Navbar_login from "../Navbar_Login/Navbar_login";
import Sidebar from "../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import client from "../../api/client";
import { clearCache } from "../../hooks/useFetch";
import "../Style/Ask_your_query.css";

toast.configure();

const Add_tags = () => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    client
      .post("/tags", { name, content })
      .then(() => {
        clearCache(); // invalidate cached /tags so the list shows the new tag
        toast.success("Tag added successfully", { position: toast.POSITION.TOP_RIGHT });
        navigate("/tags");
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Could not add tag", { position: toast.POSITION.TOP_RIGHT });
      });
  };

  return (
    <div className="ask_your_query-body">
      <Navbar_login />
      <Sidebar />
      <div className="container">
        <form onSubmit={(e) => submit(e)}>
          <div className="title">Tags</div>
          <div className="input-box underline">
            <label>Tag Name:</label>
            <input type="text" placeholder="Enter Tag Name" onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="input-box">
            <label>Tag Content:</label>
            <input type="text" placeholder="Enter Content" onChange={(e) => setContent(e.target.value)} required />
          </div>
          <div className="input-box button">
            <input type="submit" name="" value="Continue" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_tags;
