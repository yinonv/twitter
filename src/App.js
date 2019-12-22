import React from 'react';
import './App.css';
import Home from './pages/Home'
//import Profile from './pages/Profile'
import Login from './pages/Login'
import NavBar from './components/NavBar'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import firebase from 'firebase'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      exists: true,
      isSignedIn: false
    }
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
    const { isSignedIn } = this.state;
    firebase.auth().onAuthStateChanged(user => this.setState({ isSignedIn: !!user }))
  }
  handleLogOut() {
    this.setState({ isSignedIn: false });
  }
  render() {
    const { isSignedIn } = this.state;
    return (
      <div className="container">
        <Router>
          {isSignedIn && <NavBar isSignedIn={isSignedIn} logedOut={() => this.handleLogOut()} />}
          {isSignedIn && <Redirect to="/home" />}
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route exact path="/home">
              {!isSignedIn && <Redirect to="/" />}
              <Home />
            </Route>
            {/* <Route>
              <Profile exact path="/profile" />
            </Route> */}
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;
