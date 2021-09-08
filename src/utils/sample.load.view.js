export const props = (itemType) => ({
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
});
const getters = (itemType) => ({
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
});
const eventName = {
    loading: 'loading',
    refresh: 'refresh',
    loaded: 'loaded',
};
const sampleLoadView = (name, itemType) => ({
    name: `${name}`,
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
        case_event: {
            [eventName.loading]: {
                stateUpdate: {
                    loadStatus: "LoadStatusEnum.LOADING",
                    item: "null",
                    error: "null",
                },
                content: "final res = await ApiCall();",
                nextEvent: eventName.loaded,
                nextEventPayload: "item: res",
            },
            [eventName.refresh]: {
                stateUpdate: {
                    loadStatus: "LoadStatusEnum.REFRESH",
                    error: "null",
                },
                content: "final res = await ApiCall();",
                nextEvent: eventName.loaded,
                nextEventPayload: "item: res",
            },
            [eventName.loaded]: {
                stateUpdate: {
                    loadStatus: "LoadStatusEnum.DONE",
                    item: "item",
                }
            },
        },
        onError: true,
    },
    actionProp: actionProps,
});
const actionProps = { name: 'action', default: '"INIT"', typeTemplate: { string: true } };
export { sampleLoadView };
