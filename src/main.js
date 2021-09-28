import { __awaiter, __generator } from "tslib";
import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
// Import the functions you need from the SDKs you need
import firebase from "firebase/compat";
// import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false;
Vue.use(ElementUI);
new Vue({
    router: router,
    store: store,
    render: function (h) { return h(App); },
}).$mount('#app');
var firebaseApp;
export function unAuthDb() {
    return __awaiter(this, void 0, void 0, function () {
        var authService;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
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
                    authService = firebase.auth();
                    return [4 /*yield*/, authService.signInAnonymously()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, firebase.database()];
            }
        });
    });
}
export function authInApp() {
    return __awaiter(this, void 0, void 0, function () {
        var provider, authService;
        var _this = this;
        return __generator(this, function (_a) {
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
            provider = new firebase.auth.GoogleAuthProvider();
            authService = firebase.auth();
            return [2 /*return*/, authService.signInWithPopup(provider)
                    .then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                    var idToken, credential, token;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, ((_a = result.user) === null || _a === void 0 ? void 0 : _a.getIdToken())];
                            case 1:
                                idToken = _b.sent();
                                credential = firebase.auth.GoogleAuthProvider.credential(idToken);
                                token = credential.accessToken;
                                // The signed-in user info.
                                return [2 /*return*/, { user: result.user, result: result, db: firebase.database() }];
                        }
                    });
                }); }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The AuthCredential type that was used.
                    // const credential = firebase.auth.GoogleAuthProvider.credentialFromError(error);
                    // ...
                })];
        });
    });
}
var isCtrl = false;
document.onkeyup = function (e) {
    if (e.keyCode == 17)
        isCtrl = false;
};
document.onkeydown = function (e) {
    var _a, _b, _c, _d;
    if (e.keyCode == 17)
        isCtrl = true;
    if (e.keyCode == 83 && isCtrl == true) {
        var text = ((_b = (_a = document.querySelector('.codeForSave')) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : '');
        var fileName = (_d = (_c = document.querySelector('.fileName')) === null || _c === void 0 ? void 0 : _c.textContent) !== null && _d !== void 0 ? _d : '';
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