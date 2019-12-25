import React from 'react';
import './style.css'
import firebase from 'firebase'
import { usersRef } from '../../lib/api';

class UserInput extends React.Component {
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
        this.getName()
    }
    async getName() {
        const data = await this.getDoc();
        this.setState({ savedName: data.userName, saved: true })
    }
    async getDoc() {
        const uid = firebase.auth().currentUser.uid;
        const doc = await usersRef.doc(uid).get();
        return doc.data();
    }
    async handleUser() {
        const { name } = this.state;
        if (name == null) {
            return;
        }
        const uid = firebase.auth().currentUser.uid;
        const data = await this.getDoc();
        usersRef.doc(uid).set({
            userName: name,
            img: data.img,
        })
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