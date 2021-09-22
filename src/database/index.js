import firebase from "firebase/compat";
function getDataBaseRef() {
    return firebase.database();
}
async function getAllData(database) {
    return (await database.ref('/').get());
}
export { getDataBaseRef, getAllData, };
//# sourceMappingURL=index.js.map