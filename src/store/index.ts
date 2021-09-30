import Vue from 'vue'
import Vuex from 'vuex'
import {authInApp, unAuthDb} from "@/main";
import {Model, User} from "@/views/ModelEditor/RenderCodeLineType";
import {getAllData, getApiFunctions, getDataBaseRef, getModels, storeData, storeModel} from "@/database";
import firebase from "firebase/compat";
import {apiFunctionsModule, MUTATIONS_API_FUNCTIONS} from "@/store/api_functions";

Vue.use(Vuex)

export enum MUTATIONS {
    SET_USER = 'SET_USER',
    SET_DB = 'SET_DB',
    RESTORE_MODELS = 'RESTORE_MODELS',
    SET_MODEL = 'SET_MODEL',
    REMOVE_MODEL = 'REMOVE_MODEL',
    UPDATE_PENDING = 'UPDATE_PENDING',
}

export enum ACTIONS {
    RESTORE = 'RESTORE',
    LOGIN = 'LOGIN',
    SET_MODEL = 'SET_MODEL',
    REMOVE_MODEL = 'REMOVE_MODEL',
    LOAD_ALL = 'LOAD_ALL',
}

export interface RootState {
    user: { user: User } | null,
    db: firebase.database.Database | null,
    models: Model[],
    project: string,
    isPending: boolean
}

const STORE_MODELS = 'STORE_MODELS';

export default new Vuex.Store<RootState>({
    getters: {
        allModelsItems(state) {
            return state.models;
        },
        allModels(state) {
            return [...state.models.map(e => e.name), ...state.models.map(e => `List<${e.name}>`)]
        },
        allTypes(state, getters) {
            return [getters.allModels];
        },
        allModelsClasses(state): string[] {
            return [...state.models.filter(e => e.isEnum == false).map(e => e.name)]
        }
    },
    state: {
        user: null,
        db: null,
        models: [],
        project: 'mad_team',
        isPending: false,
    },
    mutations: {
        [MUTATIONS.SET_USER](state, user) {
            state.user = user;
        },
        [MUTATIONS.UPDATE_PENDING](state, status) {
            state.isPending = status;
        },
        [MUTATIONS.SET_DB](state, db) {
            Vue.set(state, 'db', db)
        },
        [MUTATIONS.RESTORE_MODELS](state, models: Model[]) {
            Vue.set(state, 'models', models)
        },
        [MUTATIONS.SET_MODEL](state, item: Model) {
            const index = state.models.findIndex(e => e.uuid == item.uuid);
            if (index != -1) {
                state.models.splice(index, 1, item);
                Vue.set(state.models, index, item)
            } else {
                state.models.push(item);
            }
        },
        [MUTATIONS.REMOVE_MODEL](state, uuid: string) {
            const index = state.models.findIndex(e => e.uuid == uuid);
            if (index != -1) {
                state.models.splice(index, 1);
            }
        },
    },
    actions: {
        async [ACTIONS.RESTORE](ctx) {
            ctx.commit(MUTATIONS.UPDATE_PENDING, true);

            const db = await unAuthDb();
            ctx.commit(MUTATIONS.SET_DB, db);

            await ctx.dispatch(ACTIONS.LOAD_ALL);

            ctx.commit(MUTATIONS.UPDATE_PENDING, false);
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
            if (ctx.state.db) {
                const [models, apiFunctions] = await Promise.all([
                    await getModels(ctx.state.db, ctx.state.project),
                    await getApiFunctions(ctx.state.db, ctx.state.project),
                ]);
                ctx.commit(MUTATIONS.RESTORE_MODELS, models);
                ctx.commit(MUTATIONS_API_FUNCTIONS.RESTORE, apiFunctions);
            }
        },
        async [ACTIONS.SET_MODEL]({state, commit}, item: Model) {
            if (state.db) {
                commit(MUTATIONS.SET_MODEL, item)
                storeModel(state.db, state.project, state.models);
            }
        },
        async [ACTIONS.REMOVE_MODEL]({state, commit}, uuid: string) {
            if (state.db) {
                commit(MUTATIONS.REMOVE_MODEL, uuid)
                storeModel(state.db, state.project, state.models);
            }
        },
    },
    modules: {
        apiFunctionsModule
    }
})
