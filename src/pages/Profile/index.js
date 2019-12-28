import React from 'react';
import './style.css';
import UserInput from '../../components/UserInput';
import firebase from 'firebase'
import { usersRef } from '../../lib/api';


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: ''
        }
    }
    componentDidMount() {
        this.setState({ file: "Choose Image" });
    }
    async handleUpload(e) {
        if (e.target.files.length == 0) {
            return;
        }
        const { upload } = this.props;
        const file = e.target.files[0];
        const fileName = file.name;
        this.setState({ file: fileName })
        await upload(file);
    }
    render() {
        const { file } = this.state;
        const { imgUrl } = this.props;
        return (
            <div className="profile-body-container">
                <h1 className="profile-title">Profile</h1>
                <img className="img-profile" src={imgUrl}></img>
                <input type="file" className="inputfile" onChange={(e) => this.handleUpload(e)} name="file" id="file" accept=".jpg, .png, .jpeg" />
                <label for="file">{file}</label>
                <UserInput />
            </div>
        )
    }
}

export default Profile;