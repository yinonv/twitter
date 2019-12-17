import React from 'react';
import './App.css';
import Home from './pages/Home'
import Profile from './pages/Profile'
import NavBar from './components/NavBar'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route>
            <Profile exact path="/profile" />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App;
