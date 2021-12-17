import firebase from "firebase/compat";
import database = firebase.database;
import {Model} from "@/views/ModelEditor/RenderCodeLineType";
import {ApiFunction, IProject} from "@/views/ApiClient/generate_code_api_client";

function getDataBaseRef() {
    return firebase.database();
}

const api = {
    getAllData: getAllData,
    getModels: getModels,
    getApiFunctions: getApiFunctions,
    storeData: storeData,
    storeApiFunction: storeApiFunction,
    storeModel: storeModel,
    getProjects: async (db: firebase.database.Database): Promise<IProject[]> => {
        return (await db.ref(getProjectsPath()).get()).val()
    },
    storeProjects: async (db: firebase.database.Database, projects: IProject[]) => {
        return db.ref(getProjectsPath()).set(projects)
    },
}

export default api;
export {api};

async function getAllData(database: firebase.database.Database) {
    return (await database.ref('/').get())
}

async function getModels(db: firebase.database.Database, project: string): Promise<Model[]> {
    return ((await db.ref(getProjectModel(project)).get()).val() ?? []);
}

async function getApiFunctions(db: firebase.database.Database, project: string): Promise<ApiFunction[]> {
    return (((await (await db.ref(getProjectApiFunctions(project)).get()).val()) as ApiFunction[]) ?? []).map(e => ({...e, params: e.params ?? []}));
}

async function storeData(db: firebase.database.Database, key: string, value: any) {
    return db.ref(key).set(value)
}

async function storeApiFunction(db: firebase.database.Database, project: string, value: ApiFunction[]) {
    return db.ref(getProjectApiFunctions(project)).set(value)
}

async function storeModel(db: firebase.database.Database, project: string, value: Model[]) {
    console.log({project, value});
    return db.ref(getProjectModel(project)).set(value?.map(e => {
        if (e.desc == undefined) e.desc = ''
        return e;
    }));
}

function getProjectApiFunctions(project: string) {
    return `/projects/${project}/api_functions`
}

function getProjectsPath() {
    return `/projects_list`
}

function getProjectModel(project: string) {
    return `/projects/${project}/models`
}
