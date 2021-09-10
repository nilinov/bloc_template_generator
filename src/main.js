import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCDt4o1A5WvH7i3LVOi-g3C7ltOIa-pyoA",
    authDomain: "bloc-template-generator.firebaseapp.com",
    databaseURL: "https://bloc-template-generator-default-rtdb.firebaseio.com",
    projectId: "bloc-template-generator",
    storageBucket: "bloc-template-generator.appspot.com",
    messagingSenderId: "63755736889",
    appId: "1:63755736889:web:11cfbc7fc531ef04bfbae8"
};
// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
//# sourceMappingURL=main.js.map