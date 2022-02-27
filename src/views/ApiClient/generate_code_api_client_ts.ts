import {Model} from "@/views/ModelEditor/RenderCodeLineType";
import _ from "lodash";
import {ApiFunction, ApiFunctionParam} from "@/views/ApiClient/generate_code_api_client";


function generateCodeApiClientTs(functions: ApiFunction[] = [], models: Model[] = []) {
    console.log('generate code', [...functions.map(e => ({...e}))])

    return `import {ApiResponse} from './utils'

export const api = {
  ${functions.map(e => {
        const model = models.find(e1 => e1.uuid == e.modelUUID);
        // console.log(`render request ${e?.name}`, e, model)

        if (model && e.isList) {
            const codePaginate = e.hasPaginate && !e.isMock ? 'params[\'page\'] = page;' : '';
            const codeSearch = e.hasSearch ? 'if (search != null) { params[\'search\'] = search; }' : '';
            const codeFilter = e.hasFilter ? 'if (filters != null) { params.addAll(params); }' : '';

            return `async ${e.name}(${getParamsApiFunction(e)}): Promise<ApiResponse<${model.name}[]>> {
        const params: { [x: string]: any } = {};
        ${codePaginate}${codeFilter} ${codeSearch}
        
        const path = basePath + ${'"' + e.path + '"' + (e.method === 'GET' ? ' + "?" + new URLSearchParams(params)' : '')};
        
        try {
        return await fetch(path, {method: "${e.method}", ${e.method !== 'GET' ? "body: JSON.stringify(params)" : ""}})
                .then(r => r.json())
                .then(r => new ApiResponse(r));
        } catch (error) {
            return new ApiResponse<${model.name}[]>(undefined, error);
        }
      },\n`;
        }

        if (!e.isList) {
            const codePaginate = e.hasPaginate && !e.isMock ? 'params[\'page\'] = page;' : '';
            const codeSearch = e.hasSearch ? 'if (search != null) { params[\'search\'] = search; }' : '';
            const codeFilter = e.hasFilter ? 'if (filters != null) { params.addAll(params); }' : '';

            return `async ${e.name}(${getParamsApiFunction(e)}): Promise<ApiResponse<${model?.name}[]>> {
        const params: { [x: string]: any } = {};
        ${codePaginate}${codeFilter}${codeSearch}
        ${postParams(e)}

        const path = basePath + ${'"' + e.path + '"' + e.params?.filter(e => e.place == 'in-path').map(e => `.replace('{${e.name}}', ${"`${" + e.name + "}`"})`) + (e.method === 'GET' ? ' + "?" + new URLSearchParams(params)' : '')};

        try {
        return await fetch(path, {method: "${e.method}", ${e.method !== 'GET' ? "body: JSON.stringify(params)" : ""}})
                .then(r => r.json())
                .then(r => new ApiResponse(r));
        } catch (error) {
            return new ApiResponse<${model?.name}>(undefined, error);
        }
      },\n`;
        }
    }).join('\n')}
}
`
}

function postParams(func: ApiFunction) {
    if (func.method != 'GET')
        return func.params?.map(param => `params["${_.snakeCase(param.name)}"] = ${param.name}`).join('\n\t')

    return ''
}

function bindParams(path: string, params: ApiFunctionParam[] = [], hasPaginate = false) {
    // console.log(`bindParams `, [...params])
    const paramsInPath = params.filter(e => e.place == 'in-path');
    let result = path;

    if (hasPaginate) {
        if (!result.includes('/page/:page'))
            result += "/page/:page";
        paramsInPath.push({name: 'page', type: 'int', place: 'in-path'});
    }

    // console.log({paramsInPath})

    for (let param of paramsInPath) {
        // console.log({param: result.split(`/:${param.name}`)})
        result = result.split(`/:${param.name}`).join(`/\$${param.name}`)
    }

    // console.log({result})

    return result;
}

function getParamsApiFunction(e: ApiFunction) {
    const res: string[] = e.params?.map(e => {
        return `${e.name},`;
    }) ?? [];

    const res2: string[] = e.params?.map(e => {
        const type = e.type.split('integer').join('number').split('int').join('number')
        return `${e.name}: ${type},`;
    }) ?? [];

    if (e.isList) {
        if (e.hasSearch) res.push('String? search,')
        if (e.hasPaginate) res.push('int page = 1,')
        if (e.hasFilter) res.push('Map<String, dynamic>? filters,')
    }

    return res.length ? `{${res.join('')}}: {${res2.join('')}}` : ''
}

export {generateCodeApiClientTs};

