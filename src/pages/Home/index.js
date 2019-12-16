import React from 'react';
import './style.css';
import TweetBox from '../../components/TweetBox';
import Message from '../../components/Message'

function Home() {

    return (
        <div className="home-body-container">
            <TweetBox />
            <Message />
        </div>
    )
}

export default Home;