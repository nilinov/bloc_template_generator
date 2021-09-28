import {BlocGetter, JsonData, Prop} from "./interfaces.js";

export const props = (itemType: string): { [x: string]: Prop } => ({
    items: {
        name: 'items',
        typeName: itemType,
        typeTemplate: {array: itemType},
        default: "[]"
    },
    meta: {
        typeName: "MetaPage",
        name: 'meta',
        default: 'MetaPage.empty()',
        typeTemplate: {class: true, nullable: true}
    },
    loadStatusEnum: {
        name: 'loadStatusEnum',
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
        content: "items.firstWhere((element) => element.id == id)",
        tags: ['load'],
    },
    currentPage: {
        name: 'currentPage',
        returnType: "int",
        content: "meta?.currentPage ?? 1",
        tags: ['pagination'],
    },
    canLoadNext: {
        name: 'canLoadNext',
        returnType: "bool",
        content: "(meta?.lastPage ?? 1) > (meta?.currentPage ?? 1) && !processLoading",
        tags: ['pagination'],
    },
    loading: {
        name: 'loading',
        returnType: "bool",
        content: "loadStatusEnum == LoadStatusEnum.LOADING",
        tags: ['load'],
    },
    loadingNext: {
        name: 'loadingNext',
        returnType: "bool",
        content: "loadStatusEnum == LoadStatusEnum.LOADING_NEXT",
        tags: ['pagination'],
    },
    processLoading: {
        name: 'processLoading',
        returnType: "bool",
        content: "[LoadStatusEnum.LOADING, LoadStatusEnum.LOADING_NEXT, LoadStatusEnum.REFRESH, LoadStatusEnum.SEARCH].contains(loadStatusEnum)",
        tags: ['load'],
    },
    showList: {
        name: 'showList',
        returnType: "bool",
        content: "[LoadStatusEnum.DONE, LoadStatusEnum.REFRESH, LoadStatusEnum.LOADING_NEXT].contains(loadStatusEnum)",
        tags: ['reload'],
    }
})

const eventName = {
    loading: 'loading',
    loadingNext: 'loadingNext',
    loaded: 'loaded',
    loadFail: 'loadFail',
    searching: 'searching',
}

const sampleLoadList = (name: string, itemType: string, params = {
    ApiCall: 'ApiCall',
    hasSearch: true,
    hasPaginate: true,
    hasFilter: true,
}): JsonData => {
    return ({
        name: `${name}`,
        state: {
            props: props(itemType),
            getters: getters(itemType)
        },
        events: [
            {name: eventName.loading, tags: ['load']},
            {
                name: eventName.loaded,
                props: {"items": props(itemType).items, "meta": props(itemType).meta},
                tags: ['load', 'reload'],
            },
            {name: eventName.loadingNext},
            {
                name: eventName.loadFail,
                props: {"error": props(itemType).error},
                isDefaultError: true,
                tags: ['pagination'],
            },
            {
                name: eventName.searching,
                props: {"search": props(itemType).search},
                tags: ['search'],
            },
        ],
        bloc: {
            case_event: {
                [eventName.loading]: {
                    stateUpdate: {
                        loadStatusEnum: "LoadStatusEnum.LOADING",
                        items: "[]",
                        error: "null",
                    },
                    content: `final res = await ${params.ApiCall}();`,
                    nextEvent: eventName.loaded,
                    nextEventPayload: "items: res.items, meta: res.meta",
                    tags: ['load'],
                },
                [eventName.searching]: {
                    stateUpdate: {
                        loadStatusEnum: "LoadStatusEnum.SEARCH",
                        items: "[]",
                        error: "null",
                        search: "search"
                    },
                    content: `final res = await ${params.ApiCall}(${params.hasSearch ? 'search: search' : ''});`,
                    nextEvent: eventName.loaded,
                    nextEventPayload: "items: res.items, meta: res.meta",
                    tags: ['search'],
                },
                [eventName.loaded]: {
                    stateUpdate: {
                        loadStatusEnum: "LoadStatusEnum.DONE",
                        items: "items",
                        meta: "meta"
                    },
                    tags: ['load'],
                },
                [eventName.loadingNext]: {
                    stateUpdate: {
                        loadStatusEnum: "LoadStatusEnum.LOADING_NEXT",
                        error: "null",
                    },
                    content: `final res = await ${params.ApiCall}(page: state.currentPage + 1, ${params.hasSearch ? 'search: state.search' : ''});`,
                    nextEvent: eventName.loaded,
                    nextEventPayload: "items: [ ...state.items, ...res.items], meta: res.meta",
                    tags: ['pagination'],
                },
                [eventName.loadFail]: {
                    stateUpdate: {
                        loadStatusEnum: "LoadStatusEnum.ERROR",
                        items: "[]",
                    },
                    tags: ['load'],
                }
            },
            onError: true,
        },
        actionProp: actionProps,
    });
}

const actionProps: Prop = {name: 'action', default: '"INIT"', typeTemplate: {string: true}};

export {sampleLoadList};