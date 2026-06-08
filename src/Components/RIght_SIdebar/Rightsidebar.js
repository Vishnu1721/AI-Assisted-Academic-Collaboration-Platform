import React from "react";
import useFetch from "../../hooks/useFetch";
import "./Rightsidebar.css";
import "../Question_Ask/Question.css";

const Rightsidebar = () => {
  // Derive the tag list from cached questions instead of a dedicated endpoint.
  const { data: questions } = useFetch("/questions");
  const tags = Array.from(
    new Set((questions || []).map((q) => q.TAGS).filter(Boolean))
  );

  return (
    <div className="tag-div">
      <div className="tag-header">
        <center><a href="/">Question Related Tags</a></center>
      </div>
      <div className="tag-nav"></div>
      <nav className="tag-nav-main">
        <ul className="tag-nav-ul">
          {tags.map((tag) => (
            <li className="tags-q main-title" key={tag}>{tag}</li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Rightsidebar;
