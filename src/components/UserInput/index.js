import React from 'react';
import './style.css'

function UserInput() {
    return (
        <div className="user-input-container">
            <div className="user-title">
                <p>User Name</p>
            </div>
            <div className="inputBox-container">
                <textarea className="user-text-box" placeholder="Enter Name"></textarea>
            </div>
            <div className="button-container">
                <button className="save-button">Save</button>
            </div>
        </div>
    )
}

export default UserInput;