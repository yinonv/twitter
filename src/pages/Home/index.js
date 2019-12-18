import React from 'react';
import './style.css';
import TweetBox from '../../components/TweetBox';
import Message from '../../components/Message'
import { createPost, getPosts, collection, db } from '../../lib/api';


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tweet: '',
            tweetsArray: null,
            loading: false,
            noUser: false
        }
        this.messages = null;
        this.interval = null;
    }
    componentDidMount() {
        this.setState({ loading: true });
        const username = JSON.parse(localStorage.getItem("username"));
        if (username == null) {
            this.setState({ noUser: true });
        }
        this.getTweets();
        this.interval = setInterval(this.getTweets.bind(this), 15000)
    }
    componentWillUnmount() {
        this.interval = null;
    }
    async getTweets() {
        let tweets = await collection.get();
        let arr = [];
        tweets.forEach(doc => arr.push(doc.data().tweet));
        this.setState({ tweetsArray: arr, loading: false })
    }
    async createNewTweet(obj) {
        try {
            const response = await createPost(obj);
        } catch (e) {
            console.log(e);
        }
    }
    // async getTweets() {
    //     try {
    //         const response = await getPosts();
    //         this.setState({ tweetsArray: response.data.tweets, loading: false })
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }
    async handleTweet(msg) {
        if (msg == '') {
            return;
        }
        const username = JSON.parse(localStorage.getItem("username"));
        if (username == null) {
            this.setState({ noUser: true });
            return;
        }
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
        await this.createNewTweet(newTweet);
    }
    render() {
        const { tweetsArray, loading, noUser } = this.state;
        return (
            <div className="home-body-container">
                {noUser && <h1 className="user-error-title">Set username in profile</h1>}
                {!noUser && <TweetBox handleTweet={(tweet) => this.handleTweet(tweet)} />}
                {loading && <img src="./loader.gif" className="loader"></img>}
                {tweetsArray != null && tweetsArray.map((tweet, i) => <Message key={i} user={tweet.userName} msg={tweet.content} time={tweet.date} />)}
            </div>
        )
    }
}

export default Home;