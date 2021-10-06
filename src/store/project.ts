import {ApiFunction, IProject} from "@/views/ApiClient/generate_code_api_client";
import {Module} from "vuex";
import {RootState} from "@/store/index";
import {api} from "@/api";
import Vue from "vue";

interface State {
    isPending: boolean,
    items: IProject[]
}

export enum MUTATIONS_PROJECT {
    RESTORE = 'MUTATIONS/PROJECT/RESTORE',
    SET = 'MUTATIONS/PROJECT/SET',
    REMOVE = 'MUTATIONS/PROJECT/REMOVE',
    UPDATE_PENDING = 'MUTATIONS/PROJECT/UPDATE_PENDING',
}

export enum ACTIONS_PROJECT {
    RESTORE = 'ACTION/PROJECT/RESTORE',
    SET = 'ACTION/PROJECT/SET',
    REMOVE = 'ACTION/PROJECT/REMOVE',
}

export const projectsModule: Module<State, RootState> = {
    state: () => ({
        items: [],
        isPending: false,
    }),
    mutations: {
        [MUTATIONS_PROJECT.RESTORE](state, items: IProject[] = []) {
            state.items = items;
        },
        [MUTATIONS_PROJECT.SET](state, item: IProject) {
            const index = state.items.findIndex(e => e.uuid == item.uuid);
            if (index != -1) {
                Vue.set(state.items, index, item)
            } else {
                state.items.push(item);
            }
        },
        [MUTATIONS_PROJECT.REMOVE](state, uuid: string) {
            const index = state.items.findIndex(e => e.uuid == uuid);
            if (index != -1) {
                state.items.splice(index, 1);
            }
        },
        [MUTATIONS_PROJECT.UPDATE_PENDING](state, pending: boolean) {
            state.isPending = pending;
        },
    },
    actions: {
        async [ACTIONS_PROJECT.RESTORE](ctx) {
            ctx.commit(MUTATIONS_PROJECT.UPDATE_PENDING, true);

            if (ctx.rootState.db) {
                const data = await api.getProjects(ctx.rootState.db)
                ctx.commit(MUTATIONS_PROJECT.RESTORE, data);
            }

            ctx.commit(MUTATIONS_PROJECT.UPDATE_PENDING, false);
        },
        async [ACTIONS_PROJECT.SET](ctx, item: IProject) {
            if (ctx.rootState.db) {
                ctx.commit(MUTATIONS_PROJECT.SET, item);
                api.storeProjects(ctx.rootState.db, ctx.state.items);
            }
        },
        async [ACTIONS_PROJECT.REMOVE](ctx, uuid: string) {
            if (ctx.rootState.db) {
                ctx.commit(MUTATIONS_PROJECT.REMOVE, uuid);
                api.storeProjects(ctx.rootState.db, ctx.state.items);
            }
        },
    },
    getters: {
        allProjects(state): IProject[] {
            return state.items ?? [];
        },
        project(state, getters, rootState): IProject | undefined {
            return (state.items ?? []).find(project => project.uuid == rootState.project_uuid);
        }
    }
}
