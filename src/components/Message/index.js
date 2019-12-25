import React from 'react';
import './style.css'
import { usersRef } from '../../lib/api'

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
        const { msg, time, date } = this.props;
        const { username, img, loaded } = this.state;
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
                    <div className="date-time-container">
                        <div className="time-date">{date}</div>
                        <div className="time-date">{time}</div>
                    </div>
                </div>
                <div className="message-content">
                    <p>{msg}</p>
                </div>
            </div>
        )
    }
}

export default Message;