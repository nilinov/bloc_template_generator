import Vue from 'vue'
import Vuex from 'vuex'
import {authInApp, unAuthDb} from "@/main";
import {Model, User} from "@/views/ModelEditor/RenderCodeLineType";
import api from "@/api";
import firebase from "firebase/compat";
import {apiFunctionsModule, MUTATIONS_API_FUNCTIONS} from "@/store/api_functions";
import {ACTIONS_PROJECT, projectsModule} from "@/store/project";

Vue.use(Vuex)

export enum MUTATIONS {
    SET_USER = 'SET_USER',
    SET_DB = 'SET_DB',
    RESTORE_MODELS = 'RESTORE_MODELS',
    SET_MODEL = 'SET_MODEL',
    REMOVE_MODEL = 'REMOVE_MODEL',
    UPDATE_PENDING = 'UPDATE_PENDING',
    SET_PROJECT = 'SET_PROJECT',
}

export enum ACTIONS {
    RESTORE = 'RESTORE',
    LOGIN = 'LOGIN',
    SET_MODEL = 'SET_MODEL',
    SET_MODELS = 'SET_MODELS',
    REMOVE_MODEL = 'REMOVE_MODEL',
    LOAD_ALL = 'LOAD_ALL',
    SET_PROJECT = 'SET_PROJECT',
}

export interface RootState {
    user: { user: User } | null,
    db: firebase.database.Database | null,
    models: Model[],
    project_uuid: string,
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
            const onlyModels = state.models.filter(e => e.isEnum == false).map(e => e.name)
            return [...onlyModels, ...onlyModels.map(e => `List<${e}>`) ]
        },
    },
    state: {
        user: null,
        db: null,
        models: [],
        project_uuid: '1',
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
        [MUTATIONS.SET_PROJECT](state, uuid: string) {
            state.project_uuid = uuid;
            localStorage.setItem('project_uuid', uuid);
        },
    },
    actions: {
        async [ACTIONS.RESTORE](ctx) {
            console.log('ACTIONS.RESTORE')
            ctx.commit(MUTATIONS.UPDATE_PENDING, true);

            const db = await unAuthDb();
            ctx.commit(MUTATIONS.SET_DB, db);

            if (localStorage.getItem('project_uuid'))
                ctx.commit(MUTATIONS.SET_PROJECT, localStorage.getItem('project_uuid'))

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
            console.log('ACTIONS.LOAD_ALL')
            if (ctx.state.db) {
                const [models, apiFunctions] = await Promise.all([
                    await api.getModels(ctx.state.db, ctx.state.project_uuid),
                    await api.getApiFunctions(ctx.state.db, ctx.state.project_uuid),
                    await ctx.dispatch(ACTIONS_PROJECT.RESTORE)
                ]);
                ctx.commit(MUTATIONS.RESTORE_MODELS, models);
                ctx.commit(MUTATIONS_API_FUNCTIONS.RESTORE, apiFunctions);
            }
        },
        async [ACTIONS.SET_MODEL]({state, commit}, item: Model) {
            if (state.db) {
                commit(MUTATIONS.SET_MODEL, item)
                api.storeModel(state.db, state.project_uuid, state.models);
            }
        },
        async [ACTIONS.SET_MODELS]({state, commit}, items: Model[]) {
            if (state.db) {
                commit(MUTATIONS.RESTORE_MODELS, items)
                await api.storeModel(state.db, state.project_uuid, state.models);
            }
        },
        async [ACTIONS.REMOVE_MODEL]({state, commit}, uuid: string) {
            if (state.db) {
                commit(MUTATIONS.REMOVE_MODEL, uuid)
                api.storeModel(state.db, state.project_uuid, state.models);
            }
        },
        async [ACTIONS.SET_PROJECT]({state, commit, dispatch, getters, rootGetters}, uuid: string) {
            console.log('ACTIONS.SET_PROJECT')
            if (state.db) {
                commit(MUTATIONS.UPDATE_PENDING, true);
                if (getters.project) {
                    commit(MUTATIONS.SET_PROJECT, uuid)
                    const [models, apiFunctions] = await Promise.all([
                        await api.getModels(state.db, state.project_uuid),
                        await api.getApiFunctions(state.db, state.project_uuid),
                    ]);
                    commit(MUTATIONS.RESTORE_MODELS, models);
                    commit(MUTATIONS_API_FUNCTIONS.RESTORE, apiFunctions);
                    commit(MUTATIONS.UPDATE_PENDING, false);
                }
            }
        },
    },
    modules: {
        apiFunctionsModule,
        projectsModule,
    }
})
