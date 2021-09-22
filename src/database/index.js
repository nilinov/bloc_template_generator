import { __awaiter, __generator } from "tslib";
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
function storeData(db, key, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db.ref(key).set(value)];
        });
    });
}
function storeModel(db, project, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db.ref(getProjectModel(project)).set(value)];
        });
    });
}
function getProjectModel(project) {
    return "/projects/" + project + "/models";
}
export { getDataBaseRef, getAllData, storeData, getModels, storeModel, };
//# sourceMappingURL=index.js.map