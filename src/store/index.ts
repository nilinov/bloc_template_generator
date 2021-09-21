import Vue from 'vue'
import Vuex from 'vuex'
import {authInApp} from "@/main";
import {Model, User} from "@/views/ModelEditor/RenderCodeLineType";

Vue.use(Vuex)

export enum MUTATIONS {
    SET_USER = 'SET_USER',
    RESTORE_MODELS = 'RESTORE_MODELS',
    SET_MODEL = 'SET_MODEL',
}

export enum ACTIONS {
    LOGIN = 'LOGIN'
}

interface State {
    user: User | null,
    models: Model[]
}

const STORE_MODELS = 'STORE_MODELS';

export default new Vuex.Store<State>({
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
                state.models = JSON.parse(localStorage.getItem(STORE_MODELS) as string);
            }
        },
        [MUTATIONS.SET_MODEL](state, model: Model) {
            const index = state.models.findIndex(e => e.uuid == model.uuid);
            if (index != -1) {
                state.models.splice(index, 1, model);
            } else {
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
})
