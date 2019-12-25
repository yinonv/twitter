import React from 'react';
import './style.css'


class TweetBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            error: false,
        }
        this.textArea = React.createRef();
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
        const { handleTweet, update } = this.props;
        this.textArea.current.value = '';
        const success = await handleTweet(inputValue);
        this.setState({ inputValue: '' })
    }
    render() {
        const { error } = this.state;
        const { loading } = this.props;
        return (
            <div className="tweetBox-container">
                <textarea ref={this.textArea} onChange={(e) => this.handlInput(e)} className="text-box" placeholder="What you have in mind..."></textarea>
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

