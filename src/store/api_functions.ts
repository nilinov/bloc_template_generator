import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";
import {Module} from "vuex";
import {RootState} from "@/store/index";
import {api} from "@/api";
import Vue from "vue";

interface State {
    isPending: boolean,
    items: ApiFunction[]
}

export enum MUTATIONS_API_FUNCTIONS {
    RESTORE = 'MUTATIONS_API_FUNCTIONS/RESTORE',
    SET = 'MUTATIONS_API_FUNCTIONS/SET',
    REMOVE = 'MUTATIONS_API_FUNCTIONS/REMOVE',
    UPDATE_PENDING = 'MUTATIONS_API_FUNCTIONS/UPDATE_PENDING',
}

export enum ACTIONS_API_FUNCTIONS {
    RESTORE = 'API_FUNCTIONS/RESTORE',
    SET = 'API_FUNCTIONS/SET',
    SET_ALL = 'API_FUNCTIONS/SET_ALL',
    REMOVE = 'API_FUNCTIONS/REMOVE',
}

export const apiFunctionsModule: Module<State, RootState> = {
    state: () => ({
        items: [],
        isPending: false,
    }),
    mutations: {
        [MUTATIONS_API_FUNCTIONS.RESTORE](state, items: ApiFunction[] = []) {
            state.items = items;
        },
        [MUTATIONS_API_FUNCTIONS.SET](state, item: ApiFunction) {
            const index = state.items.findIndex(e => e.uuid == item.uuid);
            if (index != -1) {
                Vue.set(state.items, index, item)
            } else {
                state.items.push(item);
            }
        },
        [MUTATIONS_API_FUNCTIONS.REMOVE](state, uuid: string) {
            const index = state.items.findIndex(e => e.uuid == uuid);
            if (index != -1) {
                state.items.splice(index, 1);
            }
        },
    },
    actions: {
        async [ACTIONS_API_FUNCTIONS.RESTORE](ctx) {
            ctx.commit(MUTATIONS_API_FUNCTIONS.UPDATE_PENDING, true);

            if (ctx.rootState.db) {
                const data = await api.getApiFunctions(ctx.rootState.db, ctx.rootState.project_uuid)
                ctx.commit(MUTATIONS_API_FUNCTIONS.RESTORE, data);
            }

            ctx.commit(MUTATIONS_API_FUNCTIONS.UPDATE_PENDING, false);
        },
        async [ACTIONS_API_FUNCTIONS.SET_ALL](ctx, items: ApiFunction[]) {
            ctx.commit(MUTATIONS_API_FUNCTIONS.UPDATE_PENDING, true);

            if (ctx.rootState.db) {
                ctx.commit(MUTATIONS_API_FUNCTIONS.RESTORE, items);
                await api.storeApiFunction(ctx.rootState.db, ctx.rootState.project_uuid, ctx.state.items);
            }

            ctx.commit(MUTATIONS_API_FUNCTIONS.UPDATE_PENDING, false);
        },
        async [ACTIONS_API_FUNCTIONS.SET](ctx, item: ApiFunction) {
            if (ctx.rootState.db) {
                ctx.commit(MUTATIONS_API_FUNCTIONS.SET, item);
                await api.storeApiFunction(ctx.rootState.db, ctx.rootState.project_uuid, ctx.state.items);
            }
        },
        async [ACTIONS_API_FUNCTIONS.REMOVE](ctx, uuid: string) {
            if (ctx.rootState.db) {
                ctx.commit(MUTATIONS_API_FUNCTIONS.REMOVE, uuid);
                await api.storeApiFunction(ctx.rootState.db, ctx.rootState.project_uuid, ctx.state.items);
            }
        },
    },
    getters: {
        allApiFunctions(state): ApiFunction[] {
            return state.items;
        }
    }
}
