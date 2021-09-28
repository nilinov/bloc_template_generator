var _a, _b;
import { __awaiter, __generator } from "tslib";
import { getApiFunctions, storeApiFunction } from "@/database";
import Vue from "vue";
export var MUTATIONS_API_FUNCTIONS;
(function (MUTATIONS_API_FUNCTIONS) {
    MUTATIONS_API_FUNCTIONS["RESTORE"] = "MUTATIONS_API_FUNCTIONS/RESTORE";
    MUTATIONS_API_FUNCTIONS["SET"] = "MUTATIONS_API_FUNCTIONS/SET";
    MUTATIONS_API_FUNCTIONS["REMOVE"] = "MUTATIONS_API_FUNCTIONS/REMOVE";
    MUTATIONS_API_FUNCTIONS["UPDATE_PENDING"] = "MUTATIONS_API_FUNCTIONS/UPDATE_PENDING";
})(MUTATIONS_API_FUNCTIONS || (MUTATIONS_API_FUNCTIONS = {}));
export var ACTIONS_API_FUNCTIONS;
(function (ACTIONS_API_FUNCTIONS) {
    ACTIONS_API_FUNCTIONS["RESTORE"] = "API_FUNCTIONS/RESTORE";
    ACTIONS_API_FUNCTIONS["SET"] = "API_FUNCTIONS/SET";
    ACTIONS_API_FUNCTIONS["REMOVE"] = "API_FUNCTIONS/REMOVE";
})(ACTIONS_API_FUNCTIONS || (ACTIONS_API_FUNCTIONS = {}));
export var apiFunctionsModule = {
    state: function () { return ({
        items: [],
        isPending: false,
    }); },
    mutations: (_a = {},
        _a[MUTATIONS_API_FUNCTIONS.RESTORE] = function (state, items) {
            if (items === void 0) { items = []; }
            state.items = items;
        },
        _a[MUTATIONS_API_FUNCTIONS.SET] = function (state, item) {
            var index = state.items.findIndex(function (e) { return e.uuid == item.uuid; });
            if (index != -1) {
                Vue.set(state.items, index, item);
            }
            else {
                state.items.push(item);
            }
        },
        _a[MUTATIONS_API_FUNCTIONS.REMOVE] = function (state, uuid) {
            var index = state.items.findIndex(function (e) { return e.uuid == uuid; });
            if (index != -1) {
                state.items.splice(index, 1);
            }
        },
        _a),
    actions: (_b = {},
        _b[ACTIONS_API_FUNCTIONS.RESTORE] = function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ctx.commit(MUTATIONS_API_FUNCTIONS.UPDATE_PENDING, true);
                            if (!ctx.rootState.db) return [3 /*break*/, 2];
                            return [4 /*yield*/, getApiFunctions(ctx.rootState.db, ctx.rootState.project)];
                        case 1:
                            data = _a.sent();
                            ctx.commit(MUTATIONS_API_FUNCTIONS.RESTORE, data);
                            _a.label = 2;
                        case 2:
                            ctx.commit(MUTATIONS_API_FUNCTIONS.UPDATE_PENDING, false);
                            return [2 /*return*/];
                    }
                });
            });
        },
        _b[ACTIONS_API_FUNCTIONS.SET] = function (ctx, item) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (ctx.rootState.db) {
                        ctx.commit(MUTATIONS_API_FUNCTIONS.SET, item);
                        storeApiFunction(ctx.rootState.db, ctx.rootState.project, ctx.state.items);
                    }
                    return [2 /*return*/];
                });
            });
        },
        _b[ACTIONS_API_FUNCTIONS.REMOVE] = function (ctx, uuid) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (ctx.rootState.db) {
                        ctx.commit(MUTATIONS_API_FUNCTIONS.REMOVE, uuid);
                        storeApiFunction(ctx.rootState.db, ctx.rootState.project, ctx.state.items);
                    }
                    return [2 /*return*/];
                });
            });
        },
        _b),
    getters: {
        allApiFunctions: function (state) {
            return state.items;
        }
    }
};
//# sourceMappingURL=api_functions.js.map