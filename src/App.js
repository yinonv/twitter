import React from 'react';
import './App.css';
import Home from './pages/Home/'
import Profile from './pages/Profile/'
import NavBar from './components/NavBar'

function App() {
  return (
    <div className="container">
        <NavBar />
        <Home />
    </div>
  );
}

export default App;
