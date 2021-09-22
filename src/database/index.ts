import firebase from "firebase/compat";
import database = firebase.database;
import {Model} from "@/views/ModelEditor/RenderCodeLineType";

function getDataBaseRef() {
    return firebase.database();
}

async function getAllData(database: firebase.database.Database) {
    return (await database.ref('/').get())
}

async function getModels(db: firebase.database.Database, project: string) {
    return (await db.ref(getProjectModel(project)).get()).val();
}

async function storeData(db: firebase.database.Database, key: string, value: any) {
    return db.ref(key).set(value)
}

async function storeModel(db: firebase.database.Database, project: string, value: Model[]) {
    return db.ref(getProjectModel(project)).set(value)
}

function getProjectModel(project: string) {
    return `/projects/${project}/models`
}

export {
    getDataBaseRef,
    getAllData,
    storeData,
    getModels,
    storeModel,
}
