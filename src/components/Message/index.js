import React, { Component } from 'react';
import './style.css'
import { getDatafromUID, getCurrentUid } from '../../lib/api'

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            username: '',
            img: '',
            loaded: false,
        }
    }
    componentDidMount() {
        this.setDatafromUID();
    }
    async setDatafromUID() {
        const { uid } = this.props;
        const data = await getDatafromUID(uid)
        this.setState({ username: data.userName, img: data.img, loaded: true })
    }
    render() {
        const { msg, time, date, uid, deleteCallback, image } = this.props;
        const { username, img, loaded } = this.state;
        const currentUser = getCurrentUid()
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
                            {currentUser === uid && <button className="delete-button"
                                onClick={deleteCallback}>delete</button>}
                        </div>
                    </div>
                </div>
                <div className="message-content">
                    <p className="message-text">{msg}</p>
                    {image !== undefined && <img src={image} className="tweet-image"></img>}
                </div>
            </div>
        )
    }
}

export default Message;