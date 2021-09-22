export var props = function (itemType) { return ({
    id: {
        name: 'id',
        typeTemplate: {
            int: true,
            nullable: true,
        }
    },
    item: {
        name: 'item',
        typeName: itemType,
        typeTemplate: { nullable: true }
    },
    loadStatus: {
        name: 'loadStatus',
        typeName: "LoadStatusEnum",
        typeTemplate: { enum: true },
        default: "LoadStatusEnum.INIT"
    },
    error: {
        name: 'error',
        typeTemplate: { dynamic: true },
    },
}); };
var getters = function (itemType) { return ({
    loading: {
        name: 'loading',
        returnType: "bool",
        content: "loadStatus == LoadStatusEnum.LOADING"
    },
    refreshing: {
        name: 'refreshing',
        returnType: "bool",
        content: "loadStatus == LoadStatusEnum.LOADING"
    },
}); };
var eventName = {
    loading: 'loading',
    refresh: 'refresh',
    loaded: 'loaded',
};
var sampleLoadView = function (name, itemType) {
    var _a;
    return ({
        name: "" + name,
        state: {
            props: props(itemType),
            getters: getters(itemType)
        },
        events: [
            {
                name: eventName.loading,
                props: { "id": props(itemType).id },
            },
            { name: eventName.refresh },
            {
                name: eventName.loaded,
                props: { "item": props(itemType).item }
            },
        ],
        bloc: {
            case_event: (_a = {},
                _a[eventName.loading] = {
                    stateUpdate: {
                        loadStatus: "LoadStatusEnum.LOADING",
                        item: "null",
                        error: "null",
                    },
                    content: "final res = await ApiCall();",
                    nextEvent: eventName.loaded,
                    nextEventPayload: "item: res",
                },
                _a[eventName.refresh] = {
                    stateUpdate: {
                        loadStatus: "LoadStatusEnum.REFRESH",
                        error: "null",
                    },
                    content: "final res = await ApiCall();",
                    nextEvent: eventName.loaded,
                    nextEventPayload: "item: res",
                },
                _a[eventName.loaded] = {
                    stateUpdate: {
                        loadStatus: "LoadStatusEnum.DONE",
                        item: "item",
                    }
                },
                _a),
            onError: false,
        },
        actionProp: actionProps,
    });
};
var actionProps = { name: 'action', default: '"INIT"', typeTemplate: { string: true } };
export { sampleLoadView };
//# sourceMappingURL=sample.load.view.js.map