import Vue from 'vue'
import Vuex from 'vuex'
import {authInApp, unAuthDb} from "@/main";
import {Model, User} from "@/views/ModelEditor/RenderCodeLineType";
import {getAllData, getDataBaseRef} from "@/database";
import firebase from "firebase/compat";

Vue.use(Vuex)

export enum MUTATIONS {
    SET_USER = 'SET_USER',
    SET_DB = 'SET_DB',
    RESTORE_MODELS = 'RESTORE_MODELS',
    SET_MODEL = 'SET_MODEL',
    REMOVE_MODEL = 'REMOVE_MODEL',
}

export enum ACTIONS {
    RESTORE = 'RESTORE',
    LOGIN = 'LOGIN',
    LOAD_ALL = 'LOAD_ALL',
}

interface State {
    user: { user: User } | null,
    db: firebase.database.Database | null,
    models: Model[]
}

const STORE_MODELS = 'STORE_MODELS';

export default new Vuex.Store<State>({
    getters: {
        allModels(state) {
            return [...state.models.map(e => e.name), ...state.models.map(e => `List<${e.name}>`)]
        },
        allModelsClasses(state) {
            return [...state.models.filter(e => e.isEnum == false).map(e => e.name)]
        }
    },
    state: {
        user: null,
        db: null,
        models: [],
    },
    mutations: {
        [MUTATIONS.SET_USER](state, user) {
            state.user = user;
        },
        [MUTATIONS.SET_DB](state, db) {
            state.db = db;
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
        [MUTATIONS.REMOVE_MODEL](state, uuid: string) {
            const index = state.models.findIndex(e => e.uuid == uuid);
            if (index != -1) {
                state.models.splice(index, 1);
            }
            localStorage.setItem(STORE_MODELS, JSON.stringify(state.models));
        },
    },
    actions: {
        async [ACTIONS.RESTORE](ctx) {
            ctx.commit(MUTATIONS.RESTORE_MODELS);

            const db = await unAuthDb();

            ctx.commit(MUTATIONS.SET_DB, db);

            ctx.dispatch(ACTIONS.LOAD_ALL);
        },
        async [ACTIONS.LOGIN](ctx) {
            const res = await authInApp();
            if (res) {
                ctx.commit(MUTATIONS.SET_USER, res.user);
                ctx.commit(MUTATIONS.SET_DB, res.db);
            }

            ctx.dispatch(ACTIONS.LOAD_ALL);
        },
        async [ACTIONS.LOAD_ALL](ctx) {
            if (ctx.state.db)
                getAllData(ctx.state.db)
        },
    },
    modules: {}
})
