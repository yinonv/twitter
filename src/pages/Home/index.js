import React from 'react';
import './style.css';
import TweetBox from '../../components/TweetBox';
import Message from '../../components/Message'
import { createPost, messages } from '../../lib/api';
import firebase from 'firebase'
import InfiniteLoader from 'react-infinite-loader'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tweetsArray: null,
            moreMessages: true,
        }
        this.prev = '';
        this.messages = null;
        this.tweetCounter = 10;
    }
    componentDidMount() {
        this.liveTweets();
    }
    async liveTweets() {
        messages.orderBy('fullDate', 'desc').limit(this.tweetCounter).onSnapshot(tweets => {
            let arr = [];
            tweets.forEach(doc => {
                arr.push(doc.data())
            });
            this.tweetCounter += 10;
            if (arr.length < 10) {
                this.setState({ moreMessages: false })
            }
            this.setState({ tweetsArray: null });
            this.setState({ tweetsArray: arr });
        });
    }
    getDate(date) {
        const fullYear = date.getFullYear().toString();
        const year = fullYear[2] + fullYear[3];
        const shortDate = `${date.getUTCDate()}/${date.getMonth() + 1}/${year}`;
        let minutes = date.getMinutes();
        let hours = date.getHours();
        if (parseInt(minutes) < 10) {
            minutes = `0${minutes}`
        } if (parseInt(hours) < 10) {
            hours = `0${hours}`
        }
        const time = `${hours}:${minutes}`
        return {
            date: shortDate,
            time: time
        }
    }
    async handleTweet(msg) {
        if (msg == '') {
            return;
        }
        const uid = firebase.auth().currentUser.uid;
        const fullDate = new Date;
        const shortDate = this.getDate(fullDate);
        const newTweet = {
            content: msg,
            shortDate: shortDate,
            fullDate: fullDate,
            uid: uid
        }
        createPost(newTweet);
    }
    async getMoreTweets() {
        let tweets = await messages.orderBy('fullDate', 'desc').limit(this.tweetCounter).get()
        let arr = [];
        tweets.forEach(doc => arr.push(doc.data()));
        this.prev = arr.length - this.state.tweetsArray.length;
        if (this.prev < 10) {
            this.tweetCounter += this.prev;
            this.setState({ tweetsArray: arr, moreMessages: false })
            return;
        }
        this.tweetCounter += 10;
        this.setState({ tweetsArray: arr })
    }
    render() {
        const { tweetsArray, moreMessages } = this.state;
        return (
            <div className="home-body-container">
                <TweetBox handleTweet={(tweet) => this.handleTweet(tweet)} />
                {tweetsArray != null &&
                    tweetsArray.map(tweet =>
                        <Message key={tweet.id} uid={tweet.uid}
                            msg={tweet.content} date={tweet.shortDate.date} time={tweet.shortDate.time} />
                    )}
                {moreMessages && <InfiniteLoader onVisited={() => this.getMoreTweets()} />}
                {!moreMessages && <div><h3 className="no-messages">No more messages!</h3></div>}
            </div>
        )
    }
}

export default Home;

