import React from 'react';
import './style.css';
import UserInput from '../../components/UserInput'


function Profile() {
    return (
        <div className="profile-body-container">
            <h1 className="profile-title">Profile</h1>
            <UserInput />
        </div>
    )
}

export default Profile;