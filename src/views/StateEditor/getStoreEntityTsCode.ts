import {snakeCase} from "lodash";

export function getStoreEntityTsCode(params: { modelName: string, apiMethod: string, vuexModuleName: string }) {
    const postfix = snakeCase(params.vuexModuleName + '_single').toUpperCase()
    const modelName = params.modelName;
    const examplarModel = snakeCase(params.vuexModuleName + '_single')

    return `import {Module} from "vuex/types";
import {RootState} from "@/store/index";

import {${modelName}} from '@/api/models/${snakeCase(params.modelName)}.ts'
import {api} from "@/api/api";

type T = ${modelName};

interface State {
    isPending: boolean,
    items: T[],
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

export const ${modelName}SingleModule: Module<State, RootState> = {
    // namespaced: true,
    state: {
        isPending: false,
        items: [],
    },
    mutations: {
        [MUTATIONS_${postfix}.INIT](state) {
            state.items = [];
            state.isPending = false;
        },
        [MUTATIONS_${postfix}.SET](state, {
            items,
            isPending
        }: { items: T[], isPending: boolean }) {
            state.items = items;
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
        async [ACTIONS_${postfix}.LOAD]({commit, state, dispatch}, params: {id: number}) {
            console.log('ACTIONS_${postfix}.LOAD')
            commit(MUTATIONS_${postfix}.UPDATE_PENDING, true)
            const res = await api.${params.apiMethod}(params);
            const items = [res, ...state.items.filter(e => e.id != params.id)]

            commit(MUTATIONS_${postfix}.SET, {isPending: false, items})
        },
    },
    getters: {
        ${examplarModel}ModuleItems: (state): T[] => state.items ?? [],
        ${examplarModel}ModuleByID: (state) => (id: string | number): T | undefined => state.items?.find((e: T) => e.id == id),
        ${examplarModel}ModuleIsPending: (state): boolean | undefined => state.isPending,
    }
}
`
}
