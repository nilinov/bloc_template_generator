import { __assign, __awaiter, __generator } from "tslib";
import firebase from "firebase/compat";
function getDataBaseRef() {
    return firebase.database();
}
function getAllData(database) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database.ref('/').get()];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
function getModels(db, project) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.ref(getProjectModel(project)).get()];
                case 1: return [2 /*return*/, (_a.sent()).val()];
            }
        });
    });
}
function getApiFunctions(db, project) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.ref(getProjectApiFunctions(project)).get()];
                case 1: return [4 /*yield*/, (_a.sent()).val()];
                case 2: return [2 /*return*/, (_a.sent()).map(function (e) { var _a; return (__assign(__assign({}, e), { params: (_a = e.params) !== null && _a !== void 0 ? _a : [] })); })];
            }
        });
    });
}
function storeData(db, key, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db.ref(key).set(value)];
        });
    });
}
function storeApiFunction(db, project, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db.ref(getProjectApiFunctions(project)).set(value)];
        });
    });
}
function storeModel(db, project, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db.ref(getProjectModel(project)).set(value === null || value === void 0 ? void 0 : value.map(function (e) {
                    if (e.desc == undefined)
                        e.desc = '';
                    return e;
                }))];
        });
    });
}
function getProjectApiFunctions(project) {
    return "/projects/" + project + "/api_functions";
}
function getProjectModel(project) {
    return "/projects/" + project + "/models";
}
export { getDataBaseRef, getAllData, storeData, getApiFunctions, getModels, storeApiFunction, storeModel, };
//# sourceMappingURL=index.js.map