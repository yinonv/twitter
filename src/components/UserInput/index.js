import React from 'react';
import './style.css'

class UserInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            saved: false,
            savedName: false
        }
        this.savedName = null;
    }
    componentDidMount() {
        this.savedName = JSON.parse(localStorage.getItem("username"));
        if (this.savedName == null) {
            this.setState({ saved: false, savedName: false });
            return;
        }
        this.setState({ saved: false, savedName: true });
    }
    handleUser() {
        const { name } = this.state;
        if (name == null) {
            return;
        }
        localStorage.setItem("username", JSON.stringify(name));
        this.savedName = name;
        this.setState({ saved: true });
    }
    render() {
        const { saved , savedName} = this.state;
        return (
            <div className="user-input-container">
                <div className="user-title">
                    <p>User Name {savedName && `: ${this.savedName}`}</p>
                </div>
                <div className="inputBox-container">
                    <textarea onChange={(e) => this.setState({ name: e.target.value })} className="user-text-box" placeholder="Enter Name"></textarea>
                </div>
                <div className="button-container">
                    <button className="save-button" onClick={() => this.handleUser()}>Save</button>
                </div>
                {saved && <p className="saved">Your profile has been saved</p>}
            </div>
        )
    }
}

export default UserInput;