import React from 'react';
import './style.css';
import UserInput from '../../components/UserInput'


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        document.getElementsByClassName('menu-link')[0].classList.remove('selected');
        document.getElementsByClassName('menu-link')[1].classList.add('selected');
    }
    render() {
        return (
            <div className="profile-body-container">
                <h1 className="profile-title">Profile</h1>
                <UserInput />
            </div>
        )
    }
}

export default Profile;