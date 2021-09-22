import firebase from "firebase/compat";

function getDataBaseRef() {
    return firebase.database();
}

async function getAllData(database: firebase.database.Database) {
    return (await database.ref('/').get())
}

export {
    getDataBaseRef,
    getAllData,
}
