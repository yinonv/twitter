import React from 'react';
import './style.css';
import TweetBox from '../../components/TweetBox';
import Message from '../../components/Message'
import { createPost, getPosts } from '../../api'


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tweet: '',
            tweetsArray: null,
            loading: false
        }
        this.messages = null;
    }
    componentDidMount() {
        this.setState({ loading: true })
        this.getTweets();
    }
    async createNewTweet(obj) {
        const response = await createPost(obj);
    }
    async getTweets() {
        const response = await getPosts();
        this.setState({ tweetsArray: response.data.tweets, loading: false })
    }
    handleTweet(msg) {
        if (msg == '') {
            return;
        }
        const { tweetsArray } = this.state;
        const date = new Date;
        const newTweet = {
            userName: "Yinon",
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
        this.setState({ tweet: msg, tweetsArray: newArray })
        this.createNewTweet(newTweet);
    }
    render() {
        const { tweetsArray, loading } = this.state;
        return (
            <div className="home-body-container">
                <TweetBox handleTweet={(tweet) => this.handleTweet(tweet)} />
                {loading && <img src="./loader.gif" className="loader"></img>}
                {tweetsArray != null && tweetsArray.map((tweet, i) => <Message key={i} user={tweet.userName} msg={tweet.content} time={tweet.date} />)}
            </div>
        )
    }

}

export default Home;