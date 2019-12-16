import React from 'react';
import './style.css'

function Message(props) {
    const { user, msg, time } = props;
    return (
        <div className="message-container">
            <div className="message-header">
                <p>{user}</p>
                <p>{time}</p>
            </div>
            <div className="message-content">
                <p>{msg}</p>
            </div>
        </div>
    )
}

export default Message;