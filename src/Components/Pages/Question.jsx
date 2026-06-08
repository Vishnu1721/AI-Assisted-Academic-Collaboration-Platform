import React,{useState,useEffect} from "react"
import Navbar_login from "../Navbar_Login/Navbar_login";
import Sidebar from "../Sidebar/Sidebar";
import Questions from "../Question_Ask/Questions";
import Rightsidebar from "../RIght_SIdebar/Rightsidebar";
const Questions_page = () =>{
    return(
        <div className="section-body">
            <Navbar_login/>
            <Sidebar/>
            <Rightsidebar/>
            <Questions />
        </div>
    );
};

export default Questions_page