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
        this.messages = null;
    }
    componentDidMount() {
        this.liveTweets();
    }
    liveTweets() {
        messages.orderBy('fullDate', 'desc').limit(10).onSnapshot(tweets => {
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
        console.log(docId);
        await messages.doc(docId).delete();
    }
    render() {
        const { tweetsArray, moreMessages } = this.state;
        return (
            <div className="home-body-container">
                <TweetBox handleTweet={(tweet) => this.handleTweet(tweet)} />
                {tweetsArray != null &&
                    tweetsArray.map(doc =>
                        <Message key={doc.id} uid={doc.tweet.uid} deleteCallback={() => this.deleteCallback(doc.id)}
                            msg={doc.tweet.content} date={doc.tweet.shortDate.date} time={doc.tweet.shortDate.time} />
                    )}
                {moreMessages && <InfiniteLoader onVisited={() => this.showMoreDocuments()} />}
            </div>
        )
    }
}

export default Home;

