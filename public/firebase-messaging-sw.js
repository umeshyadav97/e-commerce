// importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js');

firebase.initializeApp({
    messagingSenderId: "370695517994",
    authDomain: "gomble-fashion.firebaseapp.com",
    projectId: "gomble-fashion",
    storageBucket: "gomble-fashion.appspot.com",
    // messagingSenderId: "370695517994",
    appId: "1:370695517994:web:629b09bdeb095ad0ef1053",
    measurementId: "G-0J0MSR4GF7",
    databaseURL: "https://gomble-fashion-default-rtdb.firebaseio.com",
    apiKey: "AIzaSyCtgjTHyw0NUJqUPDObn7pPI_eKfFl4HuI",
});

const messaging = firebase.messaging();

