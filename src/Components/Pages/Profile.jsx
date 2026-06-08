import React from "react"
import Navbar_login from "../Navbar_Login/Navbar_login";
import Sidebar from "../Sidebar/Sidebar";
import "../Style/Tags.css";
import "../Pages/Login";
const Profile = (props) =>{
    const email_2 = props.data;
    console.log(email_2);
    return(
        <div className="section-body">
            <Navbar_login/>
            <Sidebar/>
            <div className="question-body">
                <div className="question-header">
                    <center><h1 className="question-h1">PROFILE</h1></center>
                </div>
            </div>
        </div>
    );
};
export default Profile