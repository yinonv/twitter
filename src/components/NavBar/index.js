import React from 'react';
import './style.css'
import { Link } from "react-router-dom";

function NavBar() {
    return (
        <header className="header">
            <div className="menu-container">
                <Link to="/home" className="menu-link">Home</Link>
                <Link to="/profile" className="menu-link">Profile</Link>
            </div>
        </header>
    )
}

export default NavBar;