import React, { useState } from "react";
import Navbar_login from "../Navbar_Login/Navbar_login";
import Sidebar from "../Sidebar/Sidebar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import { clearCache } from "../../hooks/useFetch";
import "../Style/Ask_your_query.css";

toast.configure();
const Add_Artical = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const navigate = useNavigate();

  const add_article = (e) => {
    e.preventDefault();
    client
      .post("/articles", { title, content, link })
      .then(() => {
        clearCache();
        toast.success("Article added successfully", { position: toast.POSITION.TOP_RIGHT });
        navigate("/article");
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Article adding error", { position: toast.POSITION.TOP_RIGHT });
      });
  };

  return (
    <div className="ask_your_query-body">
      <Navbar_login />
      <Sidebar />
      <div className="container">
        <form onSubmit={(e) => add_article(e)}>
          <div className="title">Add Article</div>
          <div className="input-box underline">
            <label>Title:</label>
            <input type="text" placeholder="Enter Your Title" onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="input-box">
            <label>Article Content</label>
            <input className="artical_content" type="text" placeholder="Enter Your Content" onChange={(e) => setContent(e.target.value)} required />
          </div>
          <div className="input-box">
            <label>Link</label>
            <input className="artical_content" type="text" placeholder="Enter Your Link" onChange={(e) => setLink(e.target.value)} required />
          </div>
          <div className="input-box button">
            <input type="submit" name="" value="Continue" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_Artical;
