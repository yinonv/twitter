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
        debugger;
        const { inputValue } = this.state;
        const { handleTweet } = this.props;
        this.textArea.current.value = '';
        await handleTweet(inputValue);
        this.setState({ inputValue: '' })
    }
    render() {
        const { error } = this.state;
        return (
            <div className="tweetBox-container">
                <textarea ref={this.textArea} onChange={(e) => this.handlInput(e)} className="text-box" placeholder="What you have in mind..."></textarea>
                {error &&
                    <div className="error">
                        <p className="error-text">The tweet can't contain more then 140 chars.</p>
                    </div>}
                <input type="file" className="attach" onChange={(e) => {return}} name="file" id="file" accept=".jpg, .png, .jpeg" />
                <label for="file"><img src="./attach.png" className="attach-pic"></img></label>
                <button className="tweet-button" disabled={error} onClick={(e) => this.handleButtonClick(e)}>Tweet</button>
            </div>
        )
    }
}

export default TweetBox;

