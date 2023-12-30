import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCtgjTHyw0NUJqUPDObn7pPI_eKfFl4HuI",
  authDomain: "gomble-fashion.firebaseapp.com",
  projectId: "gomble-fashion",
  storageBucket: "gomble-fashion.appspot.com",
  messagingSenderId: "370695517994",
  appId: "1:370695517994:web:629b09bdeb095ad0ef1053",
  measurementId: "G-0J0MSR4GF7",
  databaseURL: "https://gomble-fashion-default-rtdb.firebaseio.com",
};

if (firebase.messaging.isSupported()) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  } else {
    firebase.app(); // if already initialized, use that one
  }
}

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    if (firebase.messaging.isSupported()) {
      firebase.messaging().onMessage((payload) => {
        resolve(payload);
      });
    } else {
      reject(false);
    }
  });
