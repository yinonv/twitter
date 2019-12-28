import React from 'react';
import './style.css'
import { usersRef } from '../../lib/api'
import firebase from 'firebase'

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            img: '',
            loaded: false,
        }
    }
    componentDidMount() {
        const { uid } = this.props;
        this.getDatafromUID(uid);
    }
    async getDatafromUID(uid) {
        const doc = await usersRef.doc(uid).get();
        const data = doc.data();
        this.setState({ username: data.userName, img: data.img, loaded: true })
    }
    render() {
        const { msg, time, date, uid, deleteCallback, image} = this.props;
        const { username, img, loaded } = this.state;
        const currentUser = firebase.auth().currentUser.uid;
        if (!loaded) {
            return <div></div>
        }
        return (
            <div className="message-container">
                <div className="message-header">
                    <div className="message-user-info">
                        <img src={img} className="img"></img>
                        <p>{username}</p>
                    </div>
                    <div className="right-side-container">
                        <div className="date-time-container">
                            <div className="time-date">{date}</div>
                            <div className="time-date">{time}</div>
                        </div>
                        <div>
                            {currentUser == uid && <button className="delete-button"
                                onClick={deleteCallback}>delete</button>}
                        </div>
                    </div>
                </div>
                <div className="message-content">
                    <p className="message-text">{msg}</p>
                    {image != undefined && <img src={image} className="tweet-image"></img>}
                </div>
            </div>
        )
    }
}

export default Message;