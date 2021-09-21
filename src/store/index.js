import Vue from 'vue';
import Vuex from 'vuex';
import { authInApp } from "@/main";
Vue.use(Vuex);
export var MUTATIONS;
(function (MUTATIONS) {
    MUTATIONS["SET_USER"] = "SET_USER";
    MUTATIONS["RESTORE_MODELS"] = "RESTORE_MODELS";
    MUTATIONS["SET_MODEL"] = "SET_MODEL";
})(MUTATIONS || (MUTATIONS = {}));
export var ACTIONS;
(function (ACTIONS) {
    ACTIONS["LOGIN"] = "LOGIN";
})(ACTIONS || (ACTIONS = {}));
const STORE_MODELS = 'STORE_MODELS';
export default new Vuex.Store({
    getters: {
        allModels(state) {
            return [...state.models.map(e => e.name), ...state.models.map(e => `List<${e.name}>`)];
        },
        allModelsClasses(state) {
            return [...state.models.filter(e => e.isEnum == false).map(e => e.name)];
        }
    },
    state: {
        user: null,
        models: [],
    },
    mutations: {
        [MUTATIONS.SET_USER](state, user) {
            state.user = user;
        },
        [MUTATIONS.RESTORE_MODELS](state) {
            if (localStorage.getItem(STORE_MODELS)) {
                state.models = JSON.parse(localStorage.getItem(STORE_MODELS));
            }
        },
        [MUTATIONS.SET_MODEL](state, model) {
            const index = state.models.findIndex(e => e.uuid == model.uuid);
            if (index != -1) {
                state.models.splice(index, 1, model);
            }
            else {
                state.models.push(model);
            }
            localStorage.setItem(STORE_MODELS, JSON.stringify(state.models));
        },
    },
    actions: {
        async [ACTIONS.LOGIN](ctx) {
            ctx.commit(MUTATIONS.SET_USER, await authInApp());
        }
    },
    modules: {}
});
//# sourceMappingURL=index.js.map