import React from 'react';
import './style.css';
import firebase from 'firebase'
import { StyledFirebaseAuth } from 'react-firebaseui';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            username: '',
            exists: true,
            isSignedIn: false,
            wrongInput: true,
            photo: '',
        }
        this.containerRef = React.createRef();
        this.imgUrl = ''
        this.defaultImage = true;
        this.strength = ''
        this.errorMessage = ''
        this.uiConfig = {
            signInFlow: "popup",
            signInOptions:
                [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
            callbacks: {
                signInSuccess: () => false
            }
        }
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => this.setState({ isSignedIn: !!user }));
    }
    async handleLogin() {
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch((e) => {
                this.errorMessage = e.message;
                switch (e.message) {
                    case "There is no user record corresponding to this identifier. The user may have been deleted.": {
                        this.errorMessage = "User doesn't exist, please register.";
                        this.containerRef.current.classList.add('register-container')
                        this.setState({ exists: false });
                        break;
                    }
                    case "The password is invalid or the user does not have a password.": {
                        this.errorMessage = "You entered a wrong password.";
                        this.setState({ wrongInput: true });
                        break;
                    }
                    case "The email address is badly formatted.": {
                        this.errorMessage = "Please enter a valid email.";
                        this.setState({ wrongInput: true });
                        break;
                    }
                }
            });
    }
    handleUpload(e) {
        const { email } = this.state;
        console.log(e.target);
        const file = e.target.files[0];
        const storageRef = firebase.storage().ref(`${email}_image`);
        storageRef.put(file).then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadURL => {
                this.imgUrl = downloadURL;
                this.defaultImage = false;
            });
        });
    }
    handleRegister() {
        if (this.defaultImage) {
            this.imgUrl = 'https://firebasestorage.googleapis.com/v0/b/twitter-3652c.appspot.com/o/default.png?alt=media&token=f7a91030-5f3a-4c97-b9a0-21f3dbe0366f'
        }
        const { email, password, username } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(data => {
                data.user.updateProfile({
                    displayName: username,
                    photoURL: this.imgUrl,
                })
            })
            .catch(e => {
                console.log(e)
                switch (e.code) {
                    case "auth/weak-password": {
                        this.strength = "Weak password";
                        break;
                    }
                }
                switch (e.message) {
                    case "Password should be at least 6 characters": {
                        this.errorMessage = "Password should be at least 6 characters";
                        this.setState({ wrongInput: true });
                        break;
                    }
                }
            })
        this.defaultImage = true;
    }
    render() {
        const { exists, isSignedIn, wrongInput } = this.state;
        return (
            <div ref={this.containerRef} className="login-container">
                <div>
                    <h1 className="login-title">Sign in</h1>
                </div>
                <div className="input-container">
                    {!exists && <label>Enter email</label>}
                    <input onChange={(e) => this.setState({ email: e.target.value })} className="input" placeholder="email"></input>
                    {!exists && <label>Enter username</label>}
                    {!exists && <input onChange={(e) => this.setState({ username: e.target.value })} className="input" placeholder="username"></input>}
                    {!exists && <label>Enter password</label>}
                    <input onChange={(e) => this.setState({ password: e.target.value })} className="input" type="password" placeholder="password"></input>
                    {!exists && <input className="img-browser" onChange={(e) => this.handleUpload(e)} type="file" accept=".jpg, .png, .jpeg"></input>}
                </div>
                {wrongInput && <div>
                    <p className="error-message">{this.errorMessage}</p>
                    {!exists && <p className="error-message">{this.strength}</p>}
                </div>}
                {exists && <div>
                    <button onClick={() => this.handleLogin()} className="login-button">Login</button>
                </div>}
                {!exists && <div>
                    <button onClick={() => this.handleRegister()} className="login-button">Register</button>
                </div>}
                {!isSignedIn && <div><StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} /></div>}
                {isSignedIn && <div>
                    <div>{firebase.auth().currentUser.displayName}</div>
                    <button onClick={() => firebase.auth().signOut()}>Sign out</button>
                </div>}
            </div>
        )
    }
}

export default Login;