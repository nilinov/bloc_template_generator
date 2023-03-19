import firebase from "firebase/compat";
import database = firebase.database;
import {Model} from "@/views/ModelEditor/RenderCodeLineType";
import {ApiFunction, IProject} from "@/views/ApiClient/generate_code_api_client";
import DataSnapshot = firebase.database.DataSnapshot;

function getDataBaseRef() {
    return firebase.database();
}

const api = {
    getAllData: getAllData,
    getModels: getModels,
    getApiFunctions: getApiFunctions,
    getAllProjects: getAllProjects,
    storeApiFunctions: storeApiFunctions,
    storeApiFunction: storeApiFunction,
    removeApiFunction,
    storeModels: storeModels,
    storeModel: storeModel,
    removeModel: removeModel,
    getProjects: async (db: firebase.database.Database): Promise<IProject[]> => {
        return (await db.ref(getProjectsPath()).get()).val()
    },
    storeProjects: async (db: firebase.database.Database, projects: IProject[]) => {
        return db.ref(getProjectsPath()).set(projects)
    },
}

export default api;
export {api};

function middleware<T>(req: string, res: T, method: 'GET' | 'POST' | 'DELETE' = 'GET', payload: any) {
    console.log({
        method,
        request: req,
        response: JSON.parse(JSON.stringify(res)),
        payload: JSON.parse(JSON.stringify(payload ?? null))
    })
    return res;
}

async function getAllData(database: firebase.database.Database) {
    return middleware('/', (await database.ref('/').get()), 'GET', undefined)
}

async function getModels(db: firebase.database.Database, project: string): Promise<Model[]> {
    let res = (await db.ref(getProjectModel(project)).get()).val() ?? [];

    if (res instanceof Object) {
        res = Object.values(res);
    }

    return middleware(getProjectModel(project), res, 'GET', undefined);
}

async function getApiFunctions(db: firebase.database.Database, project: string): Promise<ApiFunction[]> {
    const req = getProjectApiFunctions(project);
    let res = ((await (await db.ref(getProjectApiFunctions(project)).get()).val())) ?? [];

    if (res instanceof Object) res = Object.values(res);

     res = (res.map((e: ApiFunction) => ({
        ...e,
        params: e.params ?? []
    })));

     const res2: { [key: string]: ApiFunction } = {};

     (res as ApiFunction[]).forEach((e) => {
         res2[e.uuid] = e;
     })

    return middleware(req, Object.values(res2), 'GET', undefined);
}

async function storeApiFunctions(db: firebase.database.Database, project: string, value: ApiFunction[]) {
    return middleware(getProjectApiFunctions(project), db.ref(getProjectApiFunctions(project)).set(value), 'POST', value)
}

async function storeApiFunction(db: firebase.database.Database, project: string, value: ApiFunction, uuid: string) {
    return middleware(getProjectApiFunctionByUuid(project, uuid), db.ref(getProjectApiFunctionByUuid(project, uuid)).set(value), 'POST', value)
}

async function removeApiFunction(db: firebase.database.Database, project: string, uuid: string) {
    return middleware(getProjectApiFunctionByUuid(project, uuid), db.ref(getProjectApiFunctionByUuid(project, uuid)).remove(), 'DELETE', undefined)
}

async function storeModels(db: firebase.database.Database, project: string, value: Model[]) {
    return middleware(getProjectModel(project), db.ref(getProjectModel(project)).set(value?.map(e => {
        if (e.desc == undefined) e.desc = ''
        return e;
    })), 'POST', value)
}

async function storeModel(db: firebase.database.Database, project: string, value: Model, uuid: string) {
    const payload: Model = {
        ...value,
        desc: value.desc ?? '',
    }

    return middleware(getProjectModelByUuid(project, uuid), db.ref(getProjectModelByUuid(project, uuid)).set(payload), 'POST', payload)
}

async function removeModel(db: firebase.database.Database, project: string, uuid: string) {
    return middleware(getProjectModelByUuid(project, uuid), db.ref(getProjectModelByUuid(project, uuid)).remove(), 'DELETE', undefined)
}

async function getAllProjects(db: firebase.database.Database): Promise<IProject[]> {
    return middleware(getProjectsPath(), (((await (await db.ref(getProjectsPath()).get()).val()) as IProject[]) ?? []), 'GET', undefined);
}

function getProjectApiFunctions(project: string) {
    return `/projects/${project}/api_functions`
}

function getProjectApiFunctionByUuid(project: string, uuid: string) {
    return `/projects/${project}/api_functions/${(uuid).toString().replace('.', '_')}`
}

function getProjectsPath() {
    return `/projects_list`
}

function getProjectModel(project: string) {
    return `/projects/${project}/models`
}

function getProjectModelByUuid(project: string, uuid: string) {
    return `/projects/${project}/models/${(uuid).toString().replace('.', '_')}`
}
