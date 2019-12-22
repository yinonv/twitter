import React from 'react';
import './style.css';
import TweetBox from '../../components/TweetBox';
import Message from '../../components/Message'
import { createPost, getPosts, messages } from '../../lib/api';
import firebase from 'firebase'
import InfiniteLoader from 'react-infinite-loader'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tweet: '',
            tweetsArray: null,
            noUser: false,
            moreMessages: true
        }
        this.messages = null;
        this.tweetCounter = 10;
        this.prev = 10;
    }
    componentDidMount() {
        this.liveTweets();
    }
    liveTweets() {
        messages.orderBy('date', 'desc').limit(this.tweetCounter).onSnapshot(tweets => {
            let arr = [];
            tweets.forEach(doc => {
                arr.push(doc.data())
            });
            this.tweetCounter += 10;
            this.setState({ tweetsArray: arr, loading: false })
        });
    }
    async handleTweet(msg) {
        if (msg == '') {
            return;
        }
        const username = firebase.auth().currentUser.displayName;
        const { tweetsArray } = this.state;
        const date = new Date;
        const newTweet = {
            userName: username,
            content: msg,
            date: date.toISOString()
        }
        let newArray = [];
        if (tweetsArray == null) {
            newArray = [newTweet];
        } else {
            newArray = [...tweetsArray, newTweet];
        }
        newArray.sort((a, b) => new Date(b.date) - new Date(a.date));
        this.setState({ tweet: msg, tweetsArray: newArray, noUser: false })
        createPost(newTweet);
    }
    async getMoreTweets() {
        let tweets = await messages.orderBy('date', 'desc').limit(this.tweetCounter).get()
        let arr = [];
        tweets.forEach(doc => arr.push(doc.data()));
        this.prev = arr.length - this.state.tweetsArray.length;
        if(this.prev <  10){
            this.tweetCounter += this.prev;
            this.setState({ tweetsArray: arr, loading: false , moreMessages: false})
            return;
        }
        this.tweetCounter += 10;
        this.setState({ tweetsArray: arr, loading: false })
    }
    render() {
        const { tweetsArray, moreMessages, noUser } = this.state;
        return (
            <div className="home-body-container">
                {noUser && <h1 className="user-error-title">Set username in profile</h1>}
                {!noUser && <TweetBox handleTweet={(tweet) => this.handleTweet(tweet)} />}
                {tweetsArray != null && tweetsArray.map((tweet) => <Message key={tweet.id} user={tweet.userName} msg={tweet.content} time={tweet.date} />)}
                {moreMessages && <InfiniteLoader onVisited={() => this.getMoreTweets()} />}
                {!moreMessages && <div><h3 className="no-messages">No more messages!</h3></div>}
            </div>
        )
    }
}

export default Home;