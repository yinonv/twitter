import firebase from 'firebase'

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
//firebase uiConfig
const uiConfig = {
    signInFlow: "popup",
    signInOptions:
        [firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID],
    callbacks: {
        signInSuccess: () => false
    }
}
const firebaseAuth = firebase.auth()
export { messages, uiConfig, firebaseAuth };

export function createPost(tweet) {
    messages.add(tweet);
}
export function getPosts() {
    messages.get();
}
export async function deleteTweet(uid) {
    const data = await getMessageByUID(uid)
    const imageNum = data.imageNum;
    if (imageNum != null) {
        const storageRef = firebase.storage().ref(`/message_images/${imageNum}`);
        await storageRef.delete();
    }
    return await messages.doc(uid).delete();
}
export async function getDatafromUID(uid) {
    const doc = await usersRef.doc(uid).get();
    return doc.data();
}
export async function getMessageByUID(uid) {
    const doc = await messages.doc(uid).get();
    return doc.data();
}
export function getCurrentUid() {
    return firebase.auth().currentUser.uid;
}
export function signOut() {
    firebase.auth().signOut();
}
async function upload(file, storageRef) {
    const snapshot = await storageRef.put(file);
    return await snapshot.ref.getDownloadURL();
}
export async function uploadImage(file) {
    const num = Math.random();
    const storageRef = firebase.storage().ref(`/message_images/${num}`);
    return await upload(file, storageRef)
}
export async function uploadUserImage(uid, file) {
    const storageRef = firebase.storage().ref(`/user_images/${uid}`);
    return await upload(file, storageRef)
}
export async function updateName(name) {
    const uid = getCurrentUid()
    const data = await getDatafromUID(uid)
    usersRef.doc(uid).set({
        userName: name,
        img: data.img,
    })
}
export async function getName() {
    const uid = getCurrentUid()
    const data = await getDatafromUID(uid)
    return data.userName;
}
export async function setNameAndImage(uid, name, img) {
    usersRef.doc(uid).set({
        userName: name,
        img: img,
    })
}
export async function signInWithEmail(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
}
export async function createUserWithEmail(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
}
export async function getAllTweets() {
    const querySnapshot = await messages.orderBy('fullDate', 'desc').get();
    return querySnapshot.docs;
}
export async function getNextTweets(length) {
    const first = messages
        .orderBy("fullDate", "desc")
        .limit(length);
    const documentSnapshots = await first.get()
    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    const next = messages
        .orderBy("fullDate", "desc")
        .startAfter(lastVisible)
        .limit(10);
    const nextDocumentsSnapshot = await next.get();
    return nextDocumentsSnapshot.docs;
}