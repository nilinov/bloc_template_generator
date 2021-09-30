var _a, _b;
import { __awaiter, __generator, __spreadArrays } from "tslib";
import Vue from 'vue';
import Vuex from 'vuex';
import { authInApp, unAuthDb } from "@/main";
import { getApiFunctions, getModels, storeModel } from "@/database";
import { apiFunctionsModule, MUTATIONS_API_FUNCTIONS } from "@/store/api_functions";
Vue.use(Vuex);
export var MUTATIONS;
(function (MUTATIONS) {
    MUTATIONS["SET_USER"] = "SET_USER";
    MUTATIONS["SET_DB"] = "SET_DB";
    MUTATIONS["RESTORE_MODELS"] = "RESTORE_MODELS";
    MUTATIONS["SET_MODEL"] = "SET_MODEL";
    MUTATIONS["REMOVE_MODEL"] = "REMOVE_MODEL";
    MUTATIONS["UPDATE_PENDING"] = "UPDATE_PENDING";
})(MUTATIONS || (MUTATIONS = {}));
export var ACTIONS;
(function (ACTIONS) {
    ACTIONS["RESTORE"] = "RESTORE";
    ACTIONS["LOGIN"] = "LOGIN";
    ACTIONS["SET_MODEL"] = "SET_MODEL";
    ACTIONS["REMOVE_MODEL"] = "REMOVE_MODEL";
    ACTIONS["LOAD_ALL"] = "LOAD_ALL";
})(ACTIONS || (ACTIONS = {}));
var STORE_MODELS = 'STORE_MODELS';
export default new Vuex.Store({
    getters: {
        allModelsItems: function (state) {
            return state.models;
        },
        allModels: function (state) {
            return __spreadArrays(state.models.map(function (e) { return e.name; }), state.models.map(function (e) { return "List<" + e.name + ">"; }));
        },
        allTypes: function (state, getters) {
            return [getters.allModels];
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
        isPending: false,
    },
    mutations: (_a = {},
        _a[MUTATIONS.SET_USER] = function (state, user) {
            state.user = user;
        },
        _a[MUTATIONS.UPDATE_PENDING] = function (state, status) {
            state.isPending = status;
        },
        _a[MUTATIONS.SET_DB] = function (state, db) {
            Vue.set(state, 'db', db);
        },
        _a[MUTATIONS.RESTORE_MODELS] = function (state, models) {
            Vue.set(state, 'models', models);
        },
        _a[MUTATIONS.SET_MODEL] = function (state, item) {
            var index = state.models.findIndex(function (e) { return e.uuid == item.uuid; });
            if (index != -1) {
                state.models.splice(index, 1, item);
                Vue.set(state.models, index, item);
            }
            else {
                state.models.push(item);
            }
        },
        _a[MUTATIONS.REMOVE_MODEL] = function (state, uuid) {
            var index = state.models.findIndex(function (e) { return e.uuid == uuid; });
            if (index != -1) {
                state.models.splice(index, 1);
            }
        },
        _a),
    actions: (_b = {},
        _b[ACTIONS.RESTORE] = function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var db;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ctx.commit(MUTATIONS.UPDATE_PENDING, true);
                            return [4 /*yield*/, unAuthDb()];
                        case 1:
                            db = _a.sent();
                            ctx.commit(MUTATIONS.SET_DB, db);
                            return [4 /*yield*/, ctx.dispatch(ACTIONS.LOAD_ALL)];
                        case 2:
                            _a.sent();
                            ctx.commit(MUTATIONS.UPDATE_PENDING, false);
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
                var _a, models, apiFunctions, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!ctx.state.db) return [3 /*break*/, 4];
                            _c = (_b = Promise).all;
                            return [4 /*yield*/, getModels(ctx.state.db, ctx.state.project)];
                        case 1:
                            _d = [
                                _e.sent()
                            ];
                            return [4 /*yield*/, getApiFunctions(ctx.state.db, ctx.state.project)];
                        case 2: return [4 /*yield*/, _c.apply(_b, [_d.concat([
                                    _e.sent()
                                ])])];
                        case 3:
                            _a = _e.sent(), models = _a[0], apiFunctions = _a[1];
                            ctx.commit(MUTATIONS.RESTORE_MODELS, models);
                            ctx.commit(MUTATIONS_API_FUNCTIONS.RESTORE, apiFunctions);
                            _e.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        _b[ACTIONS.SET_MODEL] = function (_a, item) {
            var state = _a.state, commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    if (state.db) {
                        commit(MUTATIONS.SET_MODEL, item);
                        storeModel(state.db, state.project, state.models);
                    }
                    return [2 /*return*/];
                });
            });
        },
        _b[ACTIONS.REMOVE_MODEL] = function (_a, uuid) {
            var state = _a.state, commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    if (state.db) {
                        commit(MUTATIONS.REMOVE_MODEL, uuid);
                        storeModel(state.db, state.project, state.models);
                    }
                    return [2 /*return*/];
                });
            });
        },
        _b),
    modules: {
        apiFunctionsModule: apiFunctionsModule
    }
});
//# sourceMappingURL=index.js.map