import {ApiFunction} from "../views/ApiClient/generate_code_api_client";

export function emptyApiFunction(): ApiFunction {
    return {
        uuid: Math.random().toString(),
        desc: '',
        name: '',
        path: '/',
        method: 'GET',
        modelUUID: '',
        isList: false,
        isMock: false,
        hasFilter: false,
        hasPaginate: false,
        hasSearch: false,
        params: [],
        tag: '',
    }
}
