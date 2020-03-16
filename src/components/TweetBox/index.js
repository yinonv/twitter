import React, { Component } from 'react';
import './style.css'
import { uploadImage } from '../../lib/api'


class TweetBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            error: false,
            image: null,
            uploading: false,
            showImage: false
        }
        this.num = null;
        this.textArea = React.createRef();
    }
    async uploadImage(e) {
        if (e.target.files.length === 0) {
            return;
        }
        this.setState({ image: './img_upload_loader.gif', showImage: true, uploading: true });
        const file = e.target.files[0];
        const downloadURL = await uploadImage(file)
        this.setState({ image: downloadURL, uploading: false });
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
    async handleButtonClick() {
        const { inputValue, image } = this.state;
        const { handleTweet } = this.props;
        await handleTweet(inputValue, image, this.num);
        this.textArea.current.value = '';
        this.setState({ inputValue: '', showImage: false, image: null })
    }
    render() {
        const { error, uploading, image, showImage } = this.state;
        return (
            <div className="tweetBox-container">
                <textarea ref={this.textArea} onChange={(e) => this.handlInput(e)}
                    className="text-box" placeholder="What you have in mind..."></textarea>
                {error &&
                    <div className="error">
                        <p className="error-text">The tweet can't contain more then 140 chars.</p>
                    </div>}
                <div>
                    <img className="image-message" src={image}
                        style={{ display: showImage ? 'block' : 'none' }}></img>
                    <input type="file" className="attach" onChange={(e) => this.uploadImage(e)} name="file" id="file" accept=".jpg, .png, .jpeg" />
                    <label for="file"><img src="./attach.png" className="attach-pic"></img></label>
                    <button className="tweet-button" disabled={error || uploading} onClick={() => this.handleButtonClick()}>Tweet</button>
                </div>
            </div>
        )
    }
}

export default TweetBox;

