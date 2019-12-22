import React from 'react';
import './style.css'
import { NavLink } from "react-router-dom";
import firebase from 'firebase'

function NavBar(props) {
    const { logedOut, isSignedIn } = props;
    return (
        <header className="header">
            <div className="menu-container">
                <div>
                    <NavLink exact to="/home" className="menu-link" activeClassName='selected'>Home</NavLink>
                    {/* <NavLink exact to="/profile" className="menu-link" activeClassName='selected'>Profile</NavLink> */}
                </div>
                <div>
                    {!isSignedIn && <NavLink exact to="/" className="menu-link" activeClassName='selected'>Login</NavLink>}
                    {isSignedIn && <div className="user-container"><img className="user-image" src={firebase.auth().currentUser.photoURL}></img>
                        <button className="logout-button" onClick={() => {
                            firebase.auth().signOut();
                            logedOut();
                        }}>Sign out</button></div>}
                </div>
            </div>
        </header>
    )
}

export default NavBar;