import React from "react"
import Navbar from "../Navbar/HomeNavbar";
import "../Style/About.css";

const About = () =>{
    return(
        <div className="body-tag">
            <Navbar/>
            <div className="section-body">
                <div className="section-tag">
                    <center><p className="para-graph">The ask your query site enables you to raise enquiries regarding your internships, academics, other sports related queries.<br/> This site helps you to connect with people around the campus.<br/> This is a platform for connecting with your seniors, juniors and your fellow students.</p></center>
                </div>
            </div>
        </div>
    );
};

export default About