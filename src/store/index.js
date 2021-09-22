import Vue from 'vue';
import Vuex from 'vuex';
import { authInApp, unAuthDb } from "@/main";
import { getModels, storeModel } from "@/database";
Vue.use(Vuex);
export var MUTATIONS;
(function (MUTATIONS) {
    MUTATIONS["SET_USER"] = "SET_USER";
    MUTATIONS["SET_DB"] = "SET_DB";
    MUTATIONS["RESTORE_MODELS"] = "RESTORE_MODELS";
    MUTATIONS["SET_MODEL"] = "SET_MODEL";
    MUTATIONS["REMOVE_MODEL"] = "REMOVE_MODEL";
})(MUTATIONS || (MUTATIONS = {}));
export var ACTIONS;
(function (ACTIONS) {
    ACTIONS["RESTORE"] = "RESTORE";
    ACTIONS["LOGIN"] = "LOGIN";
    ACTIONS["LOAD_ALL"] = "LOAD_ALL";
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
        db: null,
        models: [],
        project: 'mad_team',
    },
    mutations: {
        [MUTATIONS.SET_USER](state, user) {
            state.user = user;
        },
        [MUTATIONS.SET_DB](state, db) {
            Vue.set(state, 'db', db);
        },
        [MUTATIONS.RESTORE_MODELS](state, models) {
            Vue.set(state, 'models', models);
        },
        [MUTATIONS.SET_MODEL](state, model) {
            const index = state.models.findIndex(e => e.uuid == model.uuid);
            if (index != -1) {
                state.models.splice(index, 1, model);
            }
            else {
                state.models.push(model);
            }
            //localStorage.setItem(STORE_MODELS, JSON.stringify(state.models));
            if (state.db)
                storeModel(state.db, state.project, state.models);
        },
        [MUTATIONS.REMOVE_MODEL](state, uuid) {
            const index = state.models.findIndex(e => e.uuid == uuid);
            if (index != -1) {
                state.models.splice(index, 1);
            }
            //localStorage.setItem(STORE_MODELS, JSON.stringify(state.models));
            if (state.db)
                storeModel(state.db, state.project, state.models);
        },
    },
    actions: {
        async [ACTIONS.RESTORE](ctx) {
            // ctx.commit(MUTATIONS.RESTORE_MODELS);
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
            if (ctx.state.db) {
                const data = await getModels(ctx.state.db, ctx.state.project);
                ctx.commit(MUTATIONS.RESTORE_MODELS, data);
            }
        },
    },
    modules: {}
});
//# sourceMappingURL=index.js.map