import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";
import _ from "lodash";

export function generateParams(func: ApiFunction) {
    const codePaginate = func.hasPaginate && !func.isMock ? 'params[\'page\'] = page;' : '';
    const codeSearch = func.hasSearch ? 'if (search != null) { params[\'search\'] = search; }' : '';
    const codeFilter = func.hasFilter ? 'if (filters != null) { params.addAll(params); }' : '';

    const mainParam = func.params?.find(e => e.name == 'payload');
    if (mainParam) {
        return `    const params: { [x: string]: any } = ${mainParam.name};
    ${codePaginate}${codeFilter}${codeSearch}
    ${postParams(func, mainParam.name)}`
    } else {
        return `    const params: { [x: string]: any } = {};
    ${codePaginate}${codeFilter}${codeSearch}
    ${postParams(func, '')}`
    }
}

function postParams(func: ApiFunction, exclude: string) {
    if (func.method != 'GET')
        return func.params
            ?.filter(e => e.name != exclude)
            ?.map(param => `params["${_.snakeCase(param.name)}"] = ${param.name}`).join('\n\t')

    return ''
}

