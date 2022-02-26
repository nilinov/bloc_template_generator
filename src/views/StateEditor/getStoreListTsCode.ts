import {snakeCase} from "lodash";

export function getStoreListTsCode(params: { modelName: string, apiMethod: string, vuexModuleName: string }) {
    const postfix = snakeCase(params.vuexModuleName).toUpperCase()
    const modelName = params.modelName;
    const examplarModel = snakeCase(params.vuexModuleName)

    return `import {Module} from "vuex/types";
import {RootState} from "@/store/index";
import {MetaPage} from "@/Models/MetaPage";
import {${params.modelName}} from '@/api/models/${snakeCase(params.modelName)}.ts'
import {api} from "@/api/api";

type T = ${params.modelName};

interface State {
    isPending: boolean,
    items: T[],
    meta?: MetaPage,
}

export enum MUTATIONS_${postfix} {
    INIT = 'MUTATIONS_${postfix}/INIT',
    SET = 'MUTATIONS_${postfix}/SET',
    UPDATE_PENDING = 'MUTATIONS_${postfix}/UPDATE_PENDING',
}

export enum ACTIONS_${postfix} {
    INIT = 'ACTIONS_${postfix}/INIT',
    LOAD = 'ACTIONS_${postfix}/LOAD',
}

export const ${params.vuexModuleName}Module: Module<State, RootState> = {
    // namespaced: true,
    state: {
        isPending: false,
        items: [],
        meta: undefined,
    },
    mutations: {
        [MUTATIONS_${postfix}.INIT](state) {
            state.items = [];
            state.meta = undefined;
            state.isPending = false;
        },
        [MUTATIONS_${postfix}.SET](state, {data,meta,isPending,}: { data: T[], meta: MetaPage, isPending: boolean }) {
            state.items = data;
            state.meta = meta;
            state.isPending = isPending;
        },
        [MUTATIONS_${postfix}.UPDATE_PENDING](state, flag: boolean) {
            state.isPending = flag;
        },
    },
    actions: {
        async [ACTIONS_${postfix}.INIT]({commit}) {
            commit(MUTATIONS_${postfix}.INIT)
        },
        async [ACTIONS_${postfix}.LOAD]({commit, state}, params?: {  }) {
            console.log(\`ACTIONS_${postfix}.LOAD\`, params)
            commit(MUTATIONS_${postfix}.UPDATE_PENDING, true)
            const res = await api.${params.apiMethod}();
            commit(MUTATIONS_${postfix}.SET, {...res, isPending: false})
        },
    },
    getters: {
        ${examplarModel}ModuleItems: (state): T[] => state.items ?? [],
        ${examplarModel}ModuleMeta: (state): MetaPage | undefined => state.meta,
        ${examplarModel}ModuleIsPending: (state): boolean | undefined => state.isPending,
    }
}`
}
