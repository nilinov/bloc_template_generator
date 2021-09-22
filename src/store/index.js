var _a, _b;
import { __awaiter, __generator, __spreadArrays } from "tslib";
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
var STORE_MODELS = 'STORE_MODELS';
export default new Vuex.Store({
    getters: {
        allModels: function (state) {
            return __spreadArrays(state.models.map(function (e) { return e.name; }), state.models.map(function (e) { return "List<" + e.name + ">"; }));
        },
        allModelsClasses: function (state) {
            return __spreadArrays(state.models.filter(function (e) { return e.isEnum == false; }).map(function (e) { return e.name; }));
        }
    },
    state: {
        user: null,
        db: null,
        models: [],
        project: 'mad_team',
    },
    mutations: (_a = {},
        _a[MUTATIONS.SET_USER] = function (state, user) {
            state.user = user;
        },
        _a[MUTATIONS.SET_DB] = function (state, db) {
            Vue.set(state, 'db', db);
        },
        _a[MUTATIONS.RESTORE_MODELS] = function (state, models) {
            Vue.set(state, 'models', models);
        },
        _a[MUTATIONS.SET_MODEL] = function (state, model) {
            var index = state.models.findIndex(function (e) { return e.uuid == model.uuid; });
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
        _a[MUTATIONS.REMOVE_MODEL] = function (state, uuid) {
            var index = state.models.findIndex(function (e) { return e.uuid == uuid; });
            if (index != -1) {
                state.models.splice(index, 1);
            }
            //localStorage.setItem(STORE_MODELS, JSON.stringify(state.models));
            if (state.db)
                storeModel(state.db, state.project, state.models);
        },
        _a),
    actions: (_b = {},
        _b[ACTIONS.RESTORE] = function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var db;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, unAuthDb()];
                        case 1:
                            db = _a.sent();
                            ctx.commit(MUTATIONS.SET_DB, db);
                            return [4 /*yield*/, ctx.dispatch(ACTIONS.LOAD_ALL)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        _b[ACTIONS.LOGIN] = function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, authInApp()];
                        case 1:
                            res = _a.sent();
                            if (res) {
                                ctx.commit(MUTATIONS.SET_USER, res.user);
                                ctx.commit(MUTATIONS.SET_DB, res.db);
                            }
                            ctx.dispatch(ACTIONS.LOAD_ALL);
                            return [2 /*return*/];
                    }
                });
            });
        },
        _b[ACTIONS.LOAD_ALL] = function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!ctx.state.db) return [3 /*break*/, 2];
                            return [4 /*yield*/, getModels(ctx.state.db, ctx.state.project)];
                        case 1:
                            data = _a.sent();
                            ctx.commit(MUTATIONS.RESTORE_MODELS, data);
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        },
        _b),
    modules: {}
});
//# sourceMappingURL=index.js.map