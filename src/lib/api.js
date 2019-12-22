//import axios from 'axios';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDFPAGuLnfNZelAyGgAKavbnQga-Pggmt0",
    authDomain: "twitter-3652c.firebaseapp.com",
    databaseURL: "https://twitter-3652c.firebaseio.com",
    projectId: "twitter-3652c",
    storageBucket: "twitter-3652c.appspot.com",
    messagingSenderId: "652813629953",
    appId: "1:652813629953:web:5bab2a403364f4a7a5de00",
    measurementId: "G-Y7SMJ673WP"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();
const messages = db.collection('messages');
const users = db.collection('users');
export { messages, users, storage };

export function createPost(tweet) {
    //return axios.post(`https://itc-bootcamp-19-dot-charcha-dev.appspot.com/tweet`, { tweet });
    messages.add(tweet);
}
export function getPosts() {
    //return axios.get(`https://itc-bootcamp-19-dot-charcha-dev.appspot.com/tweet`);
    messages.get();
}
