import {snakeCase} from "lodash";
import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";
import {lowercaseFirstLetter} from "@/utils/utils";

export function getStoreListTsCode(params: { modelName: string, apis: ApiFunction[], vuexModuleName: string }) {
    const postfix = snakeCase(params.vuexModuleName).toUpperCase()
    const modelName = params.modelName;
    const examplarModel = lowercaseFirstLetter(params.vuexModuleName)

    const apis = [...params.apis].map(e => ({...e}));
    apis.sort((e1, e2) => e1.path.length < e2.path.length ? -1 : 1)

    const methodGetList = apis.find(e => e.method == 'GET')
    const methodCreateEntity = apis.find(e => e.method == 'POST')
    const methodGetEntity = apis.find(e => e.method == 'GET' && e.path.includes('{id}'))
    const methodUpdateEntity = apis.find(e => e.method == 'PUT' && e.path.includes('{id}'))
    const methodDeleteEntity = apis.find(e => e.method == 'DELETE' && e.path.includes('{id}'))

    return `import {Module} from "vuex/types";
import {RootState} from "@/store/index";
import {MetaPage} from "@/Models/MetaPage";
import {${modelName}} from '@/api/models/${snakeCase(modelName)}.ts'
import {api} from "@/api/api";

type T = ${modelName};

interface State {
    isPending: boolean,
    items: T[],
    meta?: MetaPage,
    params: { [x: string]: any }
}

export enum MUTATIONS_${postfix} {
    INIT = 'MUTATIONS_${postfix}/INIT',
    SET = 'MUTATIONS_${postfix}/SET',
    UPDATE_PENDING = 'MUTATIONS_${postfix}/UPDATE_PENDING',
}

export enum ACTIONS_${postfix} {Ï
    INIT = 'ACTIONS_${postfix}/INIT',
    LOAD = 'ACTIONS_${postfix}/LOAD',
    RELOAD = 'ACTIONS_${postfix}/RELOAD',
    ${methodCreateEntity ? `CREATE = 'ACTIONS_${postfix}/CREATE',` : ""}
    ${methodUpdateEntity ? `UPDATE = 'ACTIONS_${postfix}/UPDATE',` : ""}
    ${methodDeleteEntity ? `DELETE = 'ACTIONS_${postfix}/DELETE',` : ""}
}

export const ${modelName}Module: Module<State, RootState> = {
    // namespaced: true,
    state: {
        isPending: false,
        items: [],
        meta: undefined,
        params: {}
    },
    mutations: {
        [MUTATIONS_${postfix}.INIT](state) {
            state.items = [];
            state.meta = undefined;
            state.isPending = false;
            state.params = {};
        },
        [MUTATIONS_${postfix}.SET](state, {
            payload,
            meta,
            isPending,
            params,
        }: { payload: T[], meta: MetaPage, isPending: boolean, params?: {[x: string]: any} }) {
            state.items = payload;
            state.meta = meta;
            state.isPending = isPending;
            state.params = params ?? {};
        },
        [MUTATIONS_${postfix}.UPDATE_PENDING](state, flag: boolean) {
            state.isPending = flag;
        },
    },
    actions: {
        async [ACTIONS_${postfix}.INIT]({commit}) {
            commit(MUTATIONS_${postfix}.INIT)
        },
        async [ACTIONS_${postfix}.LOAD]({commit, state}, params?: { page: number }) {
            console.log('ACTIONS_${postfix}.LOAD', params)
            commit(MUTATIONS_${postfix}.UPDATE_PENDING, true)
            const res = await api.${methodGetList?.name}(params as any);
            commit(MUTATIONS_${postfix}.SET, {...res, isPending: false, params: params})
        },
        async [ACTIONS_${postfix}.RELOAD]({commit, state}) {
            console.log('ACTIONS_${postfix}.RELOAD')
            commit(MUTATIONS_${postfix}.UPDATE_PENDING, true)
            const res = await api.${methodGetList?.name}(state.params as any);
            commit(MUTATIONS_${postfix}.SET, {...res, isPending: false, params: state.params})
        },
        ${methodCreateEntity ? `async [ACTIONS_${postfix}.CREATE]({commit, state, dispatch}, params: T) {
            console.log('ACTIONS_${postfix}.CREATE', params)
            commit(MUTATIONS_${postfix}.UPDATE_PENDING, true)
            const res = await api.${methodCreateEntity.name}({payload: params as any});
            await dispatch(ACTIONS_${postfix}.RELOAD);
            return res;
        },` : ""}
        ${methodUpdateEntity ? `async [ACTIONS_${postfix}.UPDATE]({commit, state, dispatch}, params: T) {
            console.log('ACTIONS_${postfix}.UPDATE', params)
            commit(MUTATIONS_${postfix}.UPDATE_PENDING, true)
            const res = await api.${methodUpdateEntity.name}({payload: params, id: params.id});
            await dispatch(ACTIONS_${postfix}.RELOAD);
            return res;
        },` : ""}
        ${methodDeleteEntity ? `async [ACTIONS_${postfix}.DELETE]({commit, state, dispatch}, id: number ) {
            console.log('ACTIONS_${postfix}.DELETE', id)
            commit(MUTATIONS_${postfix}.UPDATE_PENDING, true)
            const res = await api.${methodDeleteEntity.name}({id: id});
            await dispatch(ACTIONS_${postfix}.RELOAD);
            return res;
        },` : ""}
    },
    getters: {
        ${examplarModel}ModuleItems: (state): T[] => state.items ?? [],
        ${examplarModel}ModuleMeta: (state): MetaPage | undefined => state.meta,
        ${examplarModel}ModuleIsPending: (state): boolean | undefined => state.isPending,
    }
}
`
}
