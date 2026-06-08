import React from "react";
import Navbar_login from "../Navbar_Login/Navbar_login";
import Sidebar from "../Sidebar/Sidebar";
import useFetch from "../../hooks/useFetch";
import "../Style/Tags.css";

const Article = () => {
  const { data: article } = useFetch("/articles");

  return (
    <div className="section-body">
      <Navbar_login />
      <Sidebar />
      <div className="question-body">
        <div className="question-header">
          <center><h1 className="question-h1">ARTICLE</h1></center>
          <a href="/add_artical" className="question-button"><button className="quesiton-button-width"><center>ADD ARTICLE</center></button></a>
        </div>
        <div className="question-field">
          {(article || []).map((qb) => (
            <div className="question-tag" key={qb.ID || qb.ARTICLE_TITLE}>
              <div className="flex-div">
                <span className="tags-q tags-title">TITLE:</span><span className="tags-q main-title">{qb.ARTICLE_TITLE}</span><br />
                <span className="tags-q tags-title">BODY:</span><span className="tags-q main-title">{qb.ARTICLE_CONTENT}</span><br />
                <span className="tags-q tags-title">LINK:</span><a className="main-title" href={qb.LINK} target="_blank" rel="noreferrer"><span className="tags-q main-title">CLICK ME</span></a><br />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Article;
