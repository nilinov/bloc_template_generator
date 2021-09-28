import {ApiFunction, ApiFunctionParam} from "@/views/ApiClient/FormEdit.vue";
import {Model} from "@/views/ModelEditor/RenderCodeLineType";

function generateCodeApiClient(functions: ApiFunction[] = [], models: Model[] = []) {
    console.log('generate code', [...functions.map(e => ({...e}))])

    return `import 'package:mad_teams/_imports.dart';
class Api {
  ${functions.map(e => {
        const model = models.find(e1 => e1.uuid == e.modelUUID);
        console.log(`render request ${e?.name}`, e, model)

        if (model && e.isList) {
            const codePaginate = e.hasPaginate && !e.isMock ? 'params[\'page\'] = page;' : '';
            const codeSearch = e.hasSearch ? 'if (search != null) { params[\'search\'] = search; }' : '';
            const codeFilter = e.hasFilter ? 'if (filters != null) { params.addAll(params); }' : '';

            return `static Future<ApiResponse<List<${model.name}>>> ${e.name}(${getParamsApiFunction(e)}) {
        final Map<String, dynamic> params = {};
        ${codePaginate}${codeFilter} ${codeSearch}
        return ApiClient.dio
            ${e.method == 'GET' ? `.get('${bindParams(e.path, e.params, e.isMock && e.isList)}', queryParameters: params)` : `.post('${bindParams(e.path, e.params, e.isMock && e.isList)}', data: params)`}
            .then((value) => ApiResponse(
                  ${model.name}.listFromJson(value.data['data']),
                  meta: MetaPage.fromJson(value.data['meta']),
                ))
            .catchError((error) => ApiResponse(<${model.name}>[], error: error));
      }\n`;
        }

        if (model && !e.isList) {
            const codePaginate = e.hasPaginate && !e.isMock ? 'params[\'page\'] = page;' : '';
            const codeSearch = e.hasSearch ? 'if (search != null) { params[\'search\'] = search; }' : '';
            const codeFilter = e.hasFilter ? 'if (filters != null) { params.addAll(params); }' : '';

            return `static Future<ApiResponse<${model.name}>> ${e.name}(${getParamsApiFunction(e)}) {
        final Map<String, dynamic> params = {};
        ${codePaginate}${codeFilter} ${codeSearch}
        return ApiClient.dio
            ${e.method == 'GET' ? `.get('${bindParams(e.path, e.params, e.isMock && e.isList)}', queryParameters: params)` : `.post('${bindParams(e.path, e.params, e.isMock && e.isList)}', data: params)`}
            .then((value) => ApiResponse(
                  ${model.name}.fromJson(value.data['data']),
                  meta: MetaPage.fromJson(value.data['meta']),
                ))
            .catchError((error) => ApiResponse(<${model.name}>[], error: error));
      }\n`;
        }
    }).join('\n')}
}
`
}

function bindParams(path: string, params: ApiFunctionParam[] = [], hasPaginate = false) {
    console.log(`bindParams `, [...params])
    const paramsInPath = params.filter(e => e.place == 'in-path');
    let result = path;

    if (hasPaginate) {
        result += "/page/:page"
        paramsInPath.push({name: 'page', type: 'int', place: 'in-path'});
    }

    console.log({paramsInPath})

    for (let param of paramsInPath) {
        console.log({param: result.split(`/:${param.name}`)})
        result = result.split(`/:${param.name}`).join(`/\$${param.name}`)
    }

    console.log({result})

    return result;
}

function getParamsApiFunction(e: ApiFunction) {
    const res: string[] = e.params.map(e => `required ${e.type} ${e.name}`);

    if (e.isList) {
        if (e.hasSearch) res.push('String? search,')
        if (e.hasPaginate) res.push('int page = 1,')
        if (e.hasFilter) res.push('Map<String, dynamic>? filters,')
    }

    return res.length ? `{${res.join('')}}` : ''
}

export {generateCodeApiClient};