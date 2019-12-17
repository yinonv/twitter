import React from 'react';
import './style.css'


class TweetBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            error: false,
            loading: false
        }
    }
    handlInput(e) {
        const text = e.target;
        const tweet = text.value;
        if (tweet.length > 140) {
            this.setState({ error: true })
            return;
        }
        this.setState({ inputValue: tweet, error: false });
    }
    async handleButtonClick(e) {
        const { inputValue, error } = this.state;
        const { handleTweet } = this.props;
        this.setState({ loading: true})
        await handleTweet(inputValue);
        document.querySelector('textarea').value = '';
        this.setState({ inputValue: '', loading: false})
    }
    render() {
        const { error, loading } = this.state;
        return (
            <div className="tweetBox-container">
                <textarea onChange={(e) => this.handlInput(e)} className="text-box" placeholder="What you have in mind..."></textarea>
                {error &&
                    <div className="error">
                        <p className="error-text">The tweet can't contain more then 140 chars.</p>
                    </div>}
                <button className="tweet-button" disabled={error || loading} onClick={(e) => this.handleButtonClick(e)}>Tweet</button>
            </div>
        )
    }
}

export default TweetBox;

