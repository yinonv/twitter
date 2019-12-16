import React from 'react';
import './style.css';
import TweetBox from '../../components/TweetBox';
import Message from '../../components/Message'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tweet: '',
            tweetsArray: null
        }
        this.messages = null;
    }
    componentDidMount() {
        this.setState({ tweetsArray: JSON.parse(localStorage.getItem("tweets")) });
    }
    handleTweet(msg) {
        const { tweetsArray } = this.state;
        const date = new Date;
        const newTweet = {
            user: "Yinon",
            time: date.toString(),
            message: msg
        }
        let newArray = [];
        if(tweetsArray == null){
            newArray = [newTweet];
        } else{
            newArray = [...tweetsArray, newTweet];
        }
        newArray.sort((a,b) => new Date(b.time) - new Date (a.time));
        this.setState({ tweet: msg, tweetsArray: newArray })
        localStorage.setItem("tweets", JSON.stringify(newArray));
    }
    render() {
        const { tweetsArray } = this.state;
        return (
            <div className="home-body-container">
                <TweetBox handleTweet={(tweet) => this.handleTweet(tweet)} />
                {tweetsArray != null && tweetsArray.map((tweet, i) => <Message key={i} user={tweet.user} msg={tweet.message} time={tweet.time} />)}
            </div>
        )
    }

}

export default Home;