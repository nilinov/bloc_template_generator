import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
// Import the functions you need from the SDKs you need
import firebase from "firebase/compat";
// import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
let firebaseApp;
export async function unAuthDb() {
    if (!firebaseApp)
        firebaseApp = firebase.initializeApp({
            apiKey: "AIzaSyCDt4o1A5WvH7i3LVOi-g3C7ltOIa-pyoA",
            authDomain: "bloc-template-generator.firebaseapp.com",
            databaseURL: "https://bloc-template-generator-default-rtdb.firebaseio.com",
            projectId: "bloc-template-generator",
            storageBucket: "bloc-template-generator.appspot.com",
            messagingSenderId: "63755736889",
            appId: "1:63755736889:web:11cfbc7fc531ef04bfbae8"
        });
    const authService = firebase.auth();
    await authService.signInAnonymously();
    return firebase.database();
}
export async function authInApp() {
    if (!firebaseApp)
        firebaseApp = firebase.initializeApp({
            apiKey: "AIzaSyCDt4o1A5WvH7i3LVOi-g3C7ltOIa-pyoA",
            authDomain: "bloc-template-generator.firebaseapp.com",
            databaseURL: "https://bloc-template-generator-default-rtdb.firebaseio.com",
            projectId: "bloc-template-generator",
            storageBucket: "bloc-template-generator.appspot.com",
            messagingSenderId: "63755736889",
            appId: "1:63755736889:web:11cfbc7fc531ef04bfbae8"
        });
    const provider = new firebase.auth.GoogleAuthProvider();
    const authService = firebase.auth();
    return authService.signInWithPopup(provider)
        .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const idToken = await result.user?.getIdToken();
        const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
        // @ts-ignore
        const token = credential.accessToken;
        // The signed-in user info.
        return { user: result.user, result, db: firebase.database() };
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        // const credential = firebase.auth.GoogleAuthProvider.credentialFromError(error);
        // ...
    });
}
var isCtrl = false;
document.onkeyup = function (e) {
    if (e.keyCode == 17)
        isCtrl = false;
};
document.onkeydown = function (e) {
    if (e.keyCode == 17)
        isCtrl = true;
    if (e.keyCode == 83 && isCtrl == true) {
        const text = (document.querySelector('.codeForSave')?.textContent ?? '');
        const fileName = document.querySelector('.fileName')?.textContent ?? '';
        downloadURI(fileName, text);
        return false;
    }
};
function downloadURI(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
//# sourceMappingURL=main.js.map