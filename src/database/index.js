import firebase from "firebase/compat";
function getDataBaseRef() {
    return firebase.database();
}
async function getAllData(database) {
    return (await database.ref('/').get());
}
async function getModels(db, project) {
    return (await db.ref(getProjectModel(project)).get()).val();
}
async function storeData(db, key, value) {
    return db.ref(key).set(value);
}
async function storeModel(db, project, value) {
    return db.ref(getProjectModel(project)).set(value);
}
function getProjectModel(project) {
    return `/projects/${project}/models`;
}
export { getDataBaseRef, getAllData, storeData, getModels, storeModel, };
//# sourceMappingURL=index.js.map