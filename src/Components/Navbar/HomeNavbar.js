import React,{Component} from "react"
import "./HomeNavbar.css"
import {MenuItem} from "./MenuContent"
import logo from "./logo.jpeg"

class Navbar extends Component{
    render(){
        return(
        <div>
            <nav className="NavbarItems">
                <a href="/"><img className="logo-file"src={logo} height="80vh" width="100vh" alt="Murali"/></a>
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
            </ul>
            </nav>
            </div>
        )
    }
}

export default Navbar