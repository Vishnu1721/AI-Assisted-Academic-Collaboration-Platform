import React,{Component} from "react"
import "./Search.css"

class Search_bar extends Component{
    render(){
        return(
            <form id="form" role="search">
                    <input type="search" id="query" name="q"
                    placeholder="Search..."
                    aria-label="Search through site content"/>
                    <button></button>
            </form>
        )
    }
}

export default Search_bar
