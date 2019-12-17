import React from 'react';
import './style.css'
import MyAppContext from '../../context'

class TweetBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            error: false
        }
    }
    handlInput(e) {
        const button = document.querySelector('button');
        const text = e.target;
        const tweet = text.value;
        if (tweet.length > 140) {
            button.disabled = true;
            this.setState({ error: true })
            return;
        }
        button.disabled = false;
        this.setState({ inputValue: tweet, error: false });
    }
    render() {
        const { inputValue, error } = this.state;
        const { handleTweet } = this.props;
        return (
            <div className="tweetBox-container">
                <textarea onChange={(e) => this.handlInput(e)} className="text-box" placeholder="What you have in mind..."></textarea>
                {error &&
                    <div className="error">
                        <p className="error-text">The tweet can't contain more then 140 chars.</p>
                    </div>}
                <button className="tweet-button" onClick={() => {
                    handleTweet(inputValue);
                    document.querySelector('textarea').value = '';
                    this.setState({ inputValue: '' })
                }}>Tweet</button>
            </div>
        )
    }
}

export default TweetBox;

