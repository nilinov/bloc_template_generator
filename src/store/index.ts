import Vue from 'vue'
import Vuex from 'vuex'
import {authInApp, unAuthDb} from "@/main";
import {Model, User} from "@/views/ModelEditor/RenderCodeLineType";
import api from "@/api";
import firebase from "firebase/compat";
import {ACTIONS_API_FUNCTIONS, apiFunctionsModule, MUTATIONS_API_FUNCTIONS} from "@/store/api_functions";
import {ACTIONS_PROJECT, projectsModule} from "@/store/project";
import {IProject} from "@/views/ApiClient/generate_code_api_client";

Vue.use(Vuex)

export enum MUTATIONS {
    SET_USER = 'SET_USER',
    SET_DB = 'SET_DB',
    RESTORE_MODELS = 'RESTORE_MODELS',
    SET_MODEL = 'SET_MODEL',
    REMOVE_MODEL = 'REMOVE_MODEL',
    ADD_MODEL = 'ADD_MODEL',
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
    CLONE_PROJECT = 'CLONE_PROJECT',
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
            return [...onlyModels, ...onlyModels.map(e => `List<${e}>`)]
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
        [MUTATIONS.ADD_MODEL](state, model: Model) {
            const index = state.models.findIndex(e => e.uuid == model.uuid);
            if (index != -1) {
                state.models.splice(index, 1);
            }
            state.models.push(model);
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
            const local = state.models.find(e => e.uuid == item.uuid) ?? {};
            if (state.db && JSON.stringify(item, Object.keys(item as any).sort()) != JSON.stringify(local, Object.keys(local as any).sort())) {
                commit(MUTATIONS.SET_MODEL, item)
                api.storeModel(state.db, state.project_uuid, item, item.uuid);
            }
        },
        async [ACTIONS.SET_MODELS]({state, commit}, items: Model[]) {
            if (state.db) {
                commit(MUTATIONS.RESTORE_MODELS, items)
                await api.storeModels(state.db, state.project_uuid, state.models);
            }
        },
        async [ACTIONS.REMOVE_MODEL]({state, commit}, uuid: string) {
            if (state.db) {
                commit(MUTATIONS.REMOVE_MODEL, uuid)
                api.removeModel(state.db, state.project_uuid, uuid);
            }
        },
        async [ACTIONS.SET_PROJECT]({state, commit, dispatch, getters, rootGetters}, uuid: string) {
            console.log('ACTIONS.SET_PROJECT')
            if (state.db) {
                commit(MUTATIONS.UPDATE_PENDING, true);
                commit(MUTATIONS.SET_PROJECT, uuid)
                if (getters.project) {
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
        async [ACTIONS.CLONE_PROJECT]({state, commit, dispatch, getters, rootGetters}, {
            uuid,
            version
        }: { uuid: string, version: number }) {
            console.log('ACTIONS.CLONE_PROJECT', {uuid, version})
            if (state.db) {
                commit(MUTATIONS.UPDATE_PENDING, true);
                commit(MUTATIONS.SET_PROJECT, uuid);

                const projects = [...getters.allProjects] as IProject[]
                const selectProject = projects.find(e => e.uuid == uuid) as IProject;
                const uuids = (getters.allProjects as IProject[]).map(e => Number(e.uuid));
                uuids.sort((e1, e2) => e1 > e2 ? 1 : -1);
                const newUuid = Number(uuids.pop()) + 1;

                projects.push({...selectProject, version, uuid: `${newUuid}`})

                await api.storeProjects(state.db, projects)

                await dispatch(ACTIONS_PROJECT.RESTORE)

                commit(MUTATIONS.SET_PROJECT, newUuid);

                const [models, apiFunctions] = await Promise.all([
                    await api.getModels(state.db, uuid),
                    await api.getApiFunctions(state.db, uuid),
                ]);
                await dispatch(ACTIONS.SET_MODELS, models);
                await dispatch(ACTIONS_API_FUNCTIONS.SET_ALL, apiFunctions);
                commit(MUTATIONS.UPDATE_PENDING, false);
            }
        },
    },
    modules: {
        apiFunctionsModule,
        projectsModule,
    }
})
