import React,{Component} from "react"
import "./Navbar_login.css"
import {MenuItem} from "./MenuContent.js"
import logo from "./logo.jpeg"
import logo1 from "./user.png"
import Search_bar from "../Search/Search"

class Navbar_login extends Component{
    HandleValue(){
        let a = document.getElementById("down-menu-inner-div");
        a.style.display="inline-block";
    }
    render(){
        return(
        <div>
            <nav className="NavbarItems">
                <a href="/question"><img className="logo-file"src={logo} height="80vh" width="100vh" alt="Murali"/></a>
                <h1 className="navbar-logo"><p className="paragraph">ASK YOUR QUERY</p></h1>
                <div className="Menu-icons">
                </div>
            <ul className="nav-menu">
                {MenuItem.map((item,array)=>{
                    return(
                        <li key={array}>
                            <a href={item.link} className={item.Cname}>
                                {item.title}
                            </a>
                        </li>
                    )
                })}
                <div className="login_image" ><button onClick={this.HandleValue}><img className="user-logo" src={logo1} width="32px"/></button></div>
                <nav className="down-menu" id="down-menu">
                <ul className="down-menu-ul">
                    <div id="down-menu-inner-div">
                    <li id="down-menu-li"><a href="/">Logout</a></li>
                    </div>
                </ul>
            </nav>
            </ul>
            </nav>
            
            </div>
        )
    }
    
}

export default Navbar_login