import React, { Component } from 'react';
import './style.css'
import { NavLink } from "react-router-dom";
import { signOut } from '../../lib/api'

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    handleSignOut() {
        const { logedOut } = this.props;
        signOut()
        logedOut();
    }
    readMessages() {
        const { newCount } = this.props;
        window.scrollTo(0, 0);
        newCount(0);
    }
    render() {
        const { isSignedIn, imgUrl, countNum } = this.props;
        return (
            <header className="header">
                <div className="menu-container">
                    <div>
                        <NavLink exact to="/home" className="menu-link" activeClassName='selected'>Home</NavLink>
                        <NavLink exact to="/profile" className="menu-link" activeClassName='selected'>Profile</NavLink>
                    </div>
                    <div>
                        {!isSignedIn && <NavLink exact to="/" className="menu-link" activeClassName='selected'>Login</NavLink>}
                        {isSignedIn && <div className="user-container">
                            {countNum > 0 && <div className="counter" onClick={() => this.readMessages()}>{countNum}</div>}
                            <img className="user-image" src={imgUrl}></img>
                            <button className="logout-button" onClick={() => this.handleSignOut()}>Sign out</button>
                        </div>}
                    </div>
                </div>
            </header>
        )
    }
}

export default NavBar;