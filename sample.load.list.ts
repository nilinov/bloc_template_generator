import {BlocGetter, JsonData, Prop} from "./interfaces.js";

export const defaultState = (itemType: string): { [x: string]: Prop } => ({
    items: {
        name: 'items',
        typeName: itemType,
        type: {array: itemType},
        default: "[]"
    },
    meta: {typeName: "MetaPage", name: 'meta',},
    loadStatus: {
        name: 'loadStatus',
        typeName: "LoadStatusEnum",
        type: {enum: true},
        default: "LoadStatusEnum.INIT"
    },
    error: {
        name: 'error',
        type: {dynamic: true},
    },
})

const getters = (itemType: string): { [x: string]: BlocGetter } => ({
    byId: {
        name: 'byId',
        returnType: itemType,
        params: "int id",
        content: "items.firstWhere((element) => element.id == id)"
    },
    currentPage: {
        name: 'currentPage',
        returnType: "int",
        content: "meta?.currentPage ?? 1"
    },
    canLoadNext: {
        name: 'canLoadNext',
        returnType: "bool",
        content: "(meta != null ? meta.lastPage > meta.currentPage : false) && !processLoading"
    },
    loading: {
        name: 'loading',
        returnType: "bool",
        content: "loadStatus == LoadStatusEnum.LOADING"
    },
    loadingNext: {
        name: 'loadingNext',
        returnType: "bool",
        content: "loadStatus == LoadStatusEnum.LOADING_NEXT"
    },
    processLoading: {
        name: 'processLoading',
        returnType: "bool",
        content: "[LoadStatusEnum.LOADING, LoadStatusEnum.LOADING_NEXT, LoadStatusEnum.REFRESH, LoadStatusEnum.SEARCH].contains(loadStatus)"
    },
    showList: {
        name: 'showList',
        returnType: "bool",
        content: "[LoadStatusEnum.DONE, LoadStatusEnum.REFRESH, LoadStatusEnum.LOADING_NEXT].contains(loadStatus)"
    }
})

const eventName = {
    loading: 'loading',
    loadingNext: 'loadingNext',
    loaded: 'loaded',
    loadFail: 'loadFail',
}

const sampleLoadList = (name: string, itemType: string): JsonData => ({
    name: `${name}`,
    states: [
        {
            props: defaultState(itemType),
            getters: getters(itemType)
        }
    ],
    events: [
        {name: eventName.loading},
        {
            name: eventName.loaded,
            props: {"items": defaultState(itemType).items, "meta": defaultState(itemType).meta}
        },
        {name: eventName.loadingNext},
        {
            name: eventName.loadFail,
            props: {"error": defaultState(itemType).error},
            isDefaultError: true
        }
    ],
    bloc: {
        case_event: {
            [eventName.loading]: {
                stateUpdate: {
                    loadStatus: "LoadStatusEnum.LOADING",
                    items: "[]",
                    error: "null",
                },
                content: "final res = await ApiCall();",
                nextEvent: eventName.loaded,
                nextEventPayload: "items: res.items, meta: res.meta",
            },
            [eventName.loaded]: {
                stateUpdate: {
                    loadStatus: "LoadStatusEnum.DONE",
                    items: "event.items",
                    meta: "event.meta"
                }
            },
            [eventName.loadingNext]: {
                stateUpdate: {
                    loadStatus: "LoadStatusEnum.LOADING_NEXT",
                    error: "null",
                },
                content: "final res = await ApiCall(count: 5, currentPage: state.currentPage + 1)",
                nextEvent: eventName.loaded,
                nextEventPayload: "items: [ ...state.items, ...res.items], meta: res.meta",
            },
            [eventName.loadFail]: {
                stateUpdate: {
                    loadStatus: "LoadStatusEnum.ERROR",
                    items: "[]",
                }
            }
        },
        onError: true,
    }
})
export {sampleLoadList};