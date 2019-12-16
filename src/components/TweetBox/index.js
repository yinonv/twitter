import React from 'react';
import './style.css'

function TweetBox() {}
    return (
        <div className="tweetBox-container">
            <textarea className="text-box" placeholder="What you have in mind..."></textarea>
            <button className="tweet-button">Tweet</button>
        </div>
    )
}

export default TweetBox;