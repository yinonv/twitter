import firebase from 'firebase'

const messaging = firebase.messaging();
console.log("check")
messaging.requestPermission()

export { messaging }
