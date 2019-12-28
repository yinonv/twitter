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
            newMessages: false,
        }
        this.messages = null;
    }
    componentDidMount() {
        this.liveTweets();
    }
    tweetFromDifferentUser(tweets) {
        const changes = tweets.docChanges();
        const currentUID = firebase.auth().currentUser.uid;
        let newTweet = true;
        changes.forEach(change => {
            const uid = change.doc.data().uid;
            if (change.type == "added" && uid == currentUID) {
                newTweet = false;
            }
        })
        return newTweet;
    }
    liveTweets() {
        messages.orderBy('fullDate', 'desc').limit(10).onSnapshot(tweets => {
            const { moreMessages } = this.state;
            const otherUserTweet = this.tweetFromDifferentUser(tweets);
            if (window.scrollY > 360 && otherUserTweet) {
                const { newCount } = this.props;
                newCount(0.5);
                return;
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
        const querySnapshot = await messages.orderBy('fullDate', 'desc').get();
        const docs = querySnapshot.docs;
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
    async handleTweet(msg, image) {
        if (msg == '' && image == null) {
            return;
        }
        const uid = firebase.auth().currentUser.uid;
        const fullDate = new Date;
        const shortDate = this.getDate(fullDate);
        const newTweet = {
            content: msg,
            shortDate: shortDate,
            fullDate: fullDate,
            image: image,
            uid: uid
        }
        createPost(newTweet);
    }
    async showMoreDocuments() {
        const { tweetsArray } = this.state;
        const first = messages
            .orderBy("fullDate", "desc")
            .limit(tweetsArray.length);
        const documentSnapshots = await first.get()
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        const next = messages
            .orderBy("fullDate", "desc")
            .startAfter(lastVisible)
            .limit(10);
        const nextDocumentsSnapshot = await next.get();
        if (nextDocumentsSnapshot.docs.length < 10) {
            this.setState({ moreMessages: false })
        }
        let arr = [];
        nextDocumentsSnapshot.docs.forEach(doc => arr.push({ id: doc.id, tweet: doc.data() }));
        this.setState({ tweetsArray: [...tweetsArray, ...arr] })
    }
    async deleteCallback(docId) {
        const { tweetsArray } = this.state;
        let arr = [];
        await messages.doc(docId).delete();
        if (tweetsArray.length < 10) {
            return;
        }
        tweetsArray.forEach(doc => {
            if (doc.id != docId) {
                arr.push(doc);
            }
        });
        this.setState({ tweetsArray: arr });
    }
    scrollUp() {
        const { newCount } = this.props;
        window.scrollTo(0, 0);
        this.setState({ newMessages: false })
        this.newCounter = 0;
        newCount(this.newCounter);
    }
    render() {
        const { tweetsArray, moreMessages, newMessages } = this.state;
        return (
            <div className="home-body-container">
                {newMessages && <button className="new-messages-button"
                    onClick={() => this.scrollUp()}>Check new messages!</button>}
                <TweetBox handleTweet={(tweet, image) => this.handleTweet(tweet, image)} />
                {tweetsArray != null &&
                    tweetsArray.map(doc =>
                        <Message key={doc.id} uid={doc.tweet.uid} deleteCallback={() => this.deleteCallback(doc.id)}
                            msg={doc.tweet.content} date={doc.tweet.shortDate.date}
                            time={doc.tweet.shortDate.time} image={doc.tweet.image} />
                    )}
                {moreMessages && <InfiniteLoader onVisited={() => this.showMoreDocuments()} />}
            </div>
        )
    }
}

export default Home;

