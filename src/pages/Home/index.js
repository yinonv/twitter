import React, { Component } from 'react';
import './style.css';
import TweetBox from '../../components/TweetBox';
import Message from '../../components/Message'
import { createPost, messages, getCurrentUid, deleteTweet, getAllTweets, getNextTweets } from '../../lib/api';
import InfiniteLoader from 'react-infinite-loader'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tweetsArray: null,
            moreMessages: true,
            newMessages: false,
        }
        this.messages = null;
        this.unsubscribe = null;
    }
    componentDidMount() {
        this.liveTweets();
    }
    componentWillUnmount() {
        const { newCount } = this.props;
        newCount(0);
        this.unsubscribe();
    }
    tweetFromDifferentUser(tweets) {
        const changes = tweets.docChanges();
        const currentUID = getCurrentUid();
        if (changes[0].type === "added" && changes[0].doc.data().uid !== currentUID
            && changes[0].newIndex === 0) {
            return true;
        }
        if (changes.length === 2 && changes[1].type === "added"
            && changes[1].doc.data().uid !== currentUID && changes[1].newIndex === 0) {
            return true;
        }
        return false;
    }
    liveTweets() {
        this.unsubscribe = messages.orderBy('fullDate', 'desc').limit(10).onSnapshot(tweets => {
            const { moreMessages } = this.state;
            const otherUserTweet = this.tweetFromDifferentUser(tweets);
            if (window.scrollY > 360 && otherUserTweet) {
                const { newCount } = this.props;
                newCount(1);
            }
            if (!moreMessages) {
                this.getAllMessages();
                return;
            }
            let arr = [];
            tweets.forEach(doc => {
                arr.push({ id: doc.id, tweet: doc.data() })
            });
            if (arr.length < 9) {
                this.setState({ tweetsArray: arr, moreMessages: false });
            } else {
                this.setState({ tweetsArray: arr });
            }
        });
    }
    async getAllMessages() {
        const docs = await getAllTweets();
        let arr = [];
        docs.forEach(doc => {
            arr.push({ id: doc.id, tweet: doc.data() })
        });
        this.setState({ tweetsArray: arr });
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
    async handleTweet(msg, image, imageNum) {
        if (msg === '' && image === null) {
            return;
        }
        const uid = getCurrentUid();
        const fullDate = new Date;
        const shortDate = this.getDate(fullDate);
        const newTweet = {
            content: msg,
            shortDate: shortDate,
            fullDate: fullDate,
            image: image,
            imageNum: imageNum,
            uid: uid
        }
        createPost(newTweet);
    }
    async showMoreDocuments() {
        const { tweetsArray } = this.state;
        const nextDocuments = await getNextTweets(tweetsArray.length)
        if (nextDocuments.length < 10) {
            this.setState({ moreMessages: false })
        }
        let arr = [];
        nextDocuments.forEach(doc => arr.push({ id: doc.id, tweet: doc.data() }));
        this.setState({ tweetsArray: [...tweetsArray, ...arr] })
    }
    async deleteCallback(docId) {
        const { tweetsArray } = this.state;
        let arr = [];
        await deleteTweet(docId)
        if (tweetsArray.length < 10) {
            return;
        }
        tweetsArray.forEach(doc => {
            if (doc.id !== docId) {
                arr.push(doc);
            }
        });
        this.setState({ tweetsArray: arr });
    }
    render() {
        const { tweetsArray, moreMessages } = this.state;
        return (
            <div className="home-body-container">
                <TweetBox handleTweet={(tweet, image, imageNum) => this.handleTweet(tweet, image, imageNum)} />
                {tweetsArray !== null &&
                    tweetsArray.map(doc =>
                        <Message key={doc.id} uid={doc.tweet.uid}
                            deleteCallback={() => this.deleteCallback(doc.id)}
                            msg={doc.tweet.content} date={doc.tweet.shortDate.date}
                            time={doc.tweet.shortDate.time} image={doc.tweet.image} />
                    )}
                {moreMessages && <InfiniteLoader onVisited={() => this.showMoreDocuments()} />}
            </div>
        )
    }
}

export default Home;

