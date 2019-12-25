
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
const db = firebase.firestore();
const messages = db.collection('messages');
const usersRef = db.collection('users');
export { messages , usersRef};

export function createPost(tweet) {
    messages.add(tweet);
}
export function getPosts() {
    messages.get();
}
