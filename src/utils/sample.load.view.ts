import {BlocGetter, JsonData, Prop} from "./interfaces";

export const props = (itemType: string): { [x: string]: Prop } => ({
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
        typeTemplate: {nullable: true, class: true}
    },
    loadStatusEnum: {
        name: 'loadStatusEnum',
        typeName: "LoadStatusEnum",
        typeTemplate: {enum: true},
        default: "LoadStatusEnum.INIT"
    },
    error: {
        name: 'error',
        typeTemplate: {dynamic: true},
    },
})

const getters = (itemType: string): { [x: string]: BlocGetter } => ({
    loading: {
        name: 'loading',
        returnType: "bool",
        content: "LoadStatusEnum == LoadStatusEnum.LOADING",
        tags: ["load"],
    },
    loaded: {
        name: 'loaded',
        returnType: "bool",
        content: "![LoadStatusEnum.LOADING, LoadStatusEnum.REFRESH].contains(loadStatusEnum)",
        tags: ["load"],
    },
    refreshing: {
        name: 'refreshing',
        returnType: "bool",
        content: "loadStatusEnum == LoadStatusEnum.LOADING",
        tags: ["load"],
    },
})

const eventName = {
    loading: 'loading',
    refresh: 'refresh',
    loaded: 'loaded',
}

const sampleLoadView = (name: string, itemType: string, params = {ApiCall: 'ApiCall', isSnackcase: true}): JsonData => ({
    name: `${name}`,
    isSnackcase: params.isSnackcase,
    state: {
        props: props(itemType),
        getters: getters(itemType)
    },
    events: [
        {
            name: eventName.loading,
            props: {"id": props(itemType).id},
        },
        {name: eventName.refresh},
        {
            name: eventName.loaded,
            props: {"item": props(itemType).item}
        },
    ],
    bloc: {
        case_event: {
            [eventName.loading]: {
                stateUpdate: {
                    loadStatusEnum: "LoadStatusEnum.LOADING",
                    item: "null",
                    error: "null",
                },
                content: `final res = await ${params.ApiCall}(id: id);`,
                nextEvent: eventName.loaded,
                nextEventPayload: "item: res.payload",
            },
            [eventName.refresh]: {
                stateUpdate: {
                    loadStatusEnum: "LoadStatusEnum.REFRESH",
                    error: "null",
                },
                content: `final res = await ${params.ApiCall}(id: state.id ?? 1);`,
                nextEvent: eventName.loaded,
                nextEventPayload: "item: res.payload",
            },
            [eventName.loaded]: {
                stateUpdate: {
                    loadStatusEnum: "LoadStatusEnum.DONE",
                    item: "item",
                }
            },
        },
        onError: false,
    },
    actionProp: actionProps,
})

const actionProps: Prop = {name: 'action', default: '"INIT"', typeTemplate: {string: true}};

export {sampleLoadView};
