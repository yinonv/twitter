import React from 'react';
import './style.css'

class UserInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
        }
    }
    componentDidMount() {
        const textArea = document.querySelector('textarea');
        const username = JSON.parse(localStorage.getItem("username"));
        if (username == null) {
            textArea.placeholder = "Enter Name";
        } else {
            textArea.placeholder = username;
        }

    }
    handleUser() {
        const { name } = this.state;
        localStorage.setItem("username", JSON.stringify(name));
        const textArea = document.querySelector('textarea');
        textArea.placeholder = name;
        textArea.value = '';
    }
    render() {
        const { name } = this.state;
        return (
            <div className="user-input-container">
                <div className="user-title">
                    <p>User Name</p>
                </div>
                <div className="inputBox-container">
                    <textarea onChange={(e) => this.setState({ name: e.target.value })} className="user-text-box" placeholder="Enter Name"></textarea>
                </div>
                <div className="button-container">
                    <button className="save-button" onClick={() => this.handleUser()}>Save</button>
                </div>
            </div>
        )
    }
}

export default UserInput;