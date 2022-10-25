import { Component } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

class Navbar extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="navbar">
                <NavLink to="/spirits" activeClassName="active"><div>Spirits</div></NavLink>
                <NavLink to="/invaders" activeClassName="active"><div>Invaders</div></NavLink>
            </div>
            
        )
    }
}

export default Navbar;