import React from 'react';
import './App.css';
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import NavBar from './components/NavBar'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import firebase from 'firebase'
import { usersRef } from './lib/api'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      img: '',
      exists: true,
      isSignedIn: false,
      newMessageCounter: 0,
    }
    this.uid = '';
  }
  componentDidMount() {
    this.setState({ img: 'https://firebasestorage.googleapis.com/v0/b/twitter-3652c.appspot.com/o/default.png?alt=media&token=f7a91030-5f3a-4c97-b9a0-21f3dbe0366f' })
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user });
      this.uid = user.uid;
      this.getPhoto()
    })
  }
  async getPhoto() {
    const doc = await usersRef.doc(this.uid).get();
    const data = doc.data();
    if (data != undefined) {
      this.setState({ img: data.img })
    }
  }
  handleLogOut() {
    this.setState({ isSignedIn: false, newMessageCounter: 0 });
  }
  async handleUpload(file) {
    this.setState({ img: './img_upload_loader.gif' });
    const storageRef = firebase.storage().ref(`/user_images/${this.uid}`);
    const doc = await usersRef.doc(this.uid).get();
    const name = doc.data().userName;
    const snapshot = await storageRef.put(file);
    const downloadURL = await snapshot.ref.getDownloadURL();
    usersRef.doc(this.uid).set({
      userName: name,
      img: downloadURL,
    })
    this.setState({ img: downloadURL })
  }
  getMessageNum(num) {
    const { newMessageCounter } = this.state;
    if (num == 0) {
      this.setState({ newMessageCounter: 0 });
      return;
    }
    this.setState({ newMessageCounter: newMessageCounter + num })
  }
  render() {
    const { isSignedIn, img, newMessageCounter } = this.state;
    return (
      <div className="container">
        <Router>
          {isSignedIn && <NavBar newCount={num => this.getMessageNum(num)}
            countNum={newMessageCounter} imgUrl={img} isSignedIn={isSignedIn}
            logedOut={() => this.handleLogOut()} />}
          {isSignedIn && <Redirect to="/home" />}
          <Switch>
            <Route exact path="/">
              <Login updatePhoto={() => this.getPhoto()} upload={(file) => this.handleUpload(file)} />
            </Route>
            <Route exact path="/home">
              {!isSignedIn && <Redirect to="/" />}
              <Home countNum={newMessageCounter} newCount={num => this.getMessageNum(num)} />
            </Route>
            <Route>
              {isSignedIn && <Profile upload={(file) => this.handleUpload(file)}
                imgUrl={img} exact path="/profile" />}
              {!isSignedIn && <Redirect to="/" />}
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;
