import { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <ul>
                <li>
                    <Link to="/spirits">Spirits</Link>
                </li>
                <li>
                    <Link to="/invaders">Invaders</Link>
                </li>
            </ul>
        )
    }
}

export default Navbar;