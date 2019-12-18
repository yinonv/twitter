import React from 'react';
import './style.css'
import { NavLink } from "react-router-dom";

function NavBar() {
    return (
        <header className="header">
            <div className="menu-container">
                <NavLink exact to="/" className="menu-link" activeClassName='selected'>Home</NavLink>
                <NavLink exact to="/profile" className="menu-link" activeClassName='selected'>Profile</NavLink>
            </div>
        </header>
    )
}

export default NavBar;