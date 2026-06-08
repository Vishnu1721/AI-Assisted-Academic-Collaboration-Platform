import React from "react"
import "../Question_Ask/Question.css"
import "./Sidebar.css"
const Sidebar = () =>{
    return(
    <div className="section">
        <nav className="side-nav">
            <p className="para-tag tags-q main-title">Public</p>
            <ul className="nav-tag">
            <div className="Home-tag tags-q main-title">< a href="/question"><li className="nav-list">Questions</li></a></div>
            <div className="Home-tag tags-q main-title">< a href="/tags"><li className="nav-list">Tags</li></a></div>
            <div className="Home-tag tags-q main-title">< a href="/article"><li className="nav-list">Article</li></a></div>
            </ul>
        </nav>
    </div>  
    );
};

export default Sidebar