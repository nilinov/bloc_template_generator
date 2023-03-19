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
            console.log('ACTIONS_API_FUNCTIONS.SET_ALL')
            ctx.commit(MUTATIONS_API_FUNCTIONS.UPDATE_PENDING, true);

            if (ctx.rootState.db) {
                ctx.commit(MUTATIONS_API_FUNCTIONS.RESTORE, items);

                for(const item of items) {
                    await api.storeApiFunction(ctx.rootState.db, ctx.rootState.project_uuid, item, item.uuid);
                }
            }

            ctx.commit(MUTATIONS_API_FUNCTIONS.UPDATE_PENDING, false);
        },
        async [ACTIONS_API_FUNCTIONS.SET](ctx, item: ApiFunction) {
            const local = ctx.state.items.find(e => e.uuid == item.uuid) ?? {};
            const localJson = JSON.stringify(local, Object.keys(local as any).sort())
            const itemJson = JSON.stringify(item, Object.keys(item as any).sort())

            if (ctx.rootState.db && localJson != itemJson) {
                ctx.commit(MUTATIONS_API_FUNCTIONS.SET, item);
                await api.storeApiFunction(ctx.rootState.db, ctx.rootState.project_uuid, item, item.uuid);
            }
        },
        async [ACTIONS_API_FUNCTIONS.REMOVE](ctx, uuid: string) {
            if (ctx.rootState.db) {
                ctx.commit(MUTATIONS_API_FUNCTIONS.REMOVE, uuid);
                await api.removeApiFunction(ctx.rootState.db, ctx.rootState.project_uuid, uuid);
            }
        },
    },
    getters: {
        allApiFunctions(state): ApiFunction[] {
            return state.items;
        },
        tagsApiFunctions(state) {
            const tags = state.items.map(e => e.tag).filter(e => e);

            const res: { [x: string]: boolean } = {}

            for (const tag of tags) res[tag] = true;

            return Object.keys(res);
        }
    }
}
