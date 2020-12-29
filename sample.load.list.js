export const props = (itemType) => ({
    items: {
        name: 'items',
        typeName: itemType,
        type: { array: itemType },
        default: "[]"
    },
    meta: { typeName: "MetaPage", name: 'meta', },
    loadStatus: {
        name: 'loadStatus',
        typeName: "LoadStatusEnum",
        type: { enum: true },
        default: "LoadStatusEnum.INIT"
    },
    error: {
        name: 'error',
        type: { dynamic: true },
    },
});
const getters = (itemType) => {
    var _a, _b, _c;
    return ({
        byId: {
            name: 'byId',
            returnType: (_c = (_b = (_a = props(itemType)) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.type) === null || _c === void 0 ? void 0 : _c.array,
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
            content: "meta != null ? meta.lastPage > meta.currentPage : false"
        }
    });
};
const eventName = {
    loading: 'loading',
    loadingNext: 'loadingNext',
    loaded: 'loaded',
    loadFail: 'loadFail',
};
const sampleLoadList = (name, itemType) => ({
    name: `${name}`,
    states: [
        {
            props: props(itemType),
            getters: getters(itemType)
        }
    ],
    events: [
        { name: eventName.loading },
        {
            name: eventName.loaded,
            props: { "items": props(itemType).items, "meta": props(itemType).meta }
        },
        { name: eventName.loadingNext },
        {
            name: eventName.loadFail,
            props: { "error": props(itemType).error },
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
                content: "final res = await ApiCall();",
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
});
export { sampleLoadList };
