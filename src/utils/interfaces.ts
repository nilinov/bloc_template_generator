export interface Prop {
    name: string
    typeName?: string
    typeTemplate?: {
        array?: string
        map?: {
            key: string
            value: string
        },
        int?: boolean
        string?: boolean
        double?: boolean
        enum?: boolean
        dynamic?: boolean
        nullable?: boolean
        class?: boolean
        bool?: boolean
    }
    default?: string
}

export interface BlocEvent {
    name: string
    props?: { [name: string]: Prop },
    isDefaultError?: boolean
    tags?: string[]
}

export interface BlocState {
    name?: string
    props?: { [name: string]: Prop },
    getters?: { [x: string]: BlocGetter }
}

export interface BlocGetter {
    name: string
    returnType?: string
    params?: string,
    content: string
    tags?: string[]
}

export interface CaseEvent {
    stateUpdate?: { [x: string]: string }
    content?: string
    nextEvent?: string
    nextEventPayload?: string
    tags?: string[]
}

export interface Bloc {
    case_event?: { [x: string]: CaseEvent },
    onError: boolean,
}

export interface JsonData {
    name: string,
    state: BlocState,
    events: BlocEvent[],
    bloc: Bloc,
    actionProp: Prop,
}

export type CodeLang = 'dart' | 'ts'