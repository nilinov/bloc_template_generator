import {BlocGetter, JsonData, Prop} from "./interfaces.js";

export const props = (itemType: string): { [x: string]: Prop } => ({
    items: {
        name: 'items',
        typeName: itemType,
        typeTemplate: {array: itemType},
        default: "[]"
    },
    meta: {typeName: "MetaPage", name: 'meta', default: 'MetaPage.empty()'},
    loadStatus: {
        name: 'loadStatus',
        typeName: "LoadStatusEnum",
        typeTemplate: {enum: true},
        default: "LoadStatusEnum.INIT"
    },
    search: {
        name: 'search',
        typeTemplate: {string: true, nullable: true},
        default: 'null',
    },
    error: {
        name: 'error',
        typeTemplate: {dynamic: true},
    },
})

const getters = (itemType: string): { [x: string]: BlocGetter } => ({
    byId: {
        name: 'byId',
        returnType: props(itemType)?.items?.typeTemplate?.array,
        params: "int id",
        content: "items.firstWhere((element) => element.id == id)"
    },
    currentPage: {
        name: 'currentPage',
        returnType: "int",
        content: "meta.currentPage"
    },
    canLoadNext: {
        name: 'canLoadNext',
        returnType: "bool",
        content: "meta.lastPage > meta.currentPage && !processLoading"
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
    searching: 'searching',
}

const sampleLoadList = (name: string, itemType: string): JsonData => ({
    name: `${name}`,
    state: {
        props: props(itemType),
        getters: getters(itemType)
    },
    events: [
        {name: eventName.loading},
        {
            name: eventName.loaded,
            props: {"items": props(itemType).items, "meta": props(itemType).meta}
        },
        {name: eventName.loadingNext},
        {
            name: eventName.loadFail,
            props: {"error": props(itemType).error},
            isDefaultError: true
        },
        {
            name: eventName.searching,
            props: {"search": props(itemType).search},
        },
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
            [eventName.searching]: {
                stateUpdate: {
                    loadStatus: "LoadStatusEnum.SEARCH",
                    items: "[]",
                    error: "null",
                    search: "search"
                },
                content: "final res = await ApiCall(search: search);",
                nextEvent: eventName.loaded,
                nextEventPayload: "items: res.items, meta: res.meta",
            },
            [eventName.loaded]: {
                stateUpdate: {
                    loadStatus: "LoadStatusEnum.DONE",
                    items: "items",
                    meta: "meta"
                }
            },
            [eventName.loadingNext]: {
                stateUpdate: {
                    loadStatus: "LoadStatusEnum.LOADING_NEXT",
                    error: "null",
                },
                content: "final res = await ApiCall(count: 5, currentPage: state.currentPage + 1, search: state.search);",
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
    },
    actionProp: actionProps,
})

const actionProps: Prop = {name: 'action', default: '"INIT"', typeTemplate: {string: true}};

export {sampleLoadList};