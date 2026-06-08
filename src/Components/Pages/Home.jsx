import React from "react"
import Navbar from "../Navbar/HomeNavbar";
import "../Style/Home.css"
import  logo from "../Navbar/logo.jpeg"
const Home = () =>{
    return(
        <div>
        <div className="body-tag">
            <Navbar/>
        </div>
        <div className="section-body">
        <center>
            <img src={logo} className="img-home"/>
            <h1 className="home-header">ASK YOUR QUERY IN SYSTEM</h1>
            <a className="home-link"href="/login"><button className="login">LOGIN</button></a><a className="home-link" href="/signup"><button className="signup">SIGNUP</button></a>
        </center>
        </div>
        </div>
    );
};

export default Home