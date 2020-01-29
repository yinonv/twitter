import React, { Component } from 'react';
import './style.css'
import { updateName, getName } from '../../lib/api';

class UserInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            saved: false,
            savedName: false
        }
        this.message = '';
    }
    componentDidMount() {
        this.setState({ saved: false });
        this.setName()
    }
    async setName() {
        const username = await getName()
        this.setState({ savedName: username, saved: true })
    }
    async handleUser() {
        const { name } = this.state;
        if (name == null) {
            return;
        }
        await updateName(name)
        this.message = "Your profile has been saved."
        this.setState({ saved: true, savedName: name });
    }
    render() {
        const { saved, savedName } = this.state;
        return (
            <div className="user-input-container">
                <div className="user-title">
                    <p>User Name {saved && `: ${savedName}`}</p>
                </div>
                <div className="inputBox-container">
                    <textarea onChange={(e) => this.setState({ name: e.target.value })} className="user-text-box" placeholder="Enter Name"></textarea>
                </div>
                <div className="button-container">
                    <p className="saved">{this.message}</p>
                    <button className="save-button" onClick={() => this.handleUser()}>Save</button>
                </div>
            </div>
        )
    }
}

export default UserInput;