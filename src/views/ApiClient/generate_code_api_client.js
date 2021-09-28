import { __assign, __spreadArrays } from "tslib";
function generateCodeApiClient(functions, models) {
    if (functions === void 0) { functions = []; }
    if (models === void 0) { models = []; }
    console.log('generate code', __spreadArrays(functions.map(function (e) { return (__assign({}, e)); })));
    return "import 'package:mad_teams/_imports.dart';\nclass Api {\n  " + functions.map(function (e) {
        var model = models.find(function (e1) { return e1.uuid == e.modelUUID; });
        // console.log(`render request ${e?.name}`, e, model)
        if (model && e.isList) {
            var codePaginate = e.hasPaginate && !e.isMock ? 'params[\'page\'] = page;' : '';
            var codeSearch = e.hasSearch ? 'if (search != null) { params[\'search\'] = search; }' : '';
            var codeFilter = e.hasFilter ? 'if (filters != null) { params.addAll(params); }' : '';
            return "static Future<ApiResponse<List<" + model.name + ">>> " + e.name + "(" + getParamsApiFunction(e) + ") {\n        final Map<String, dynamic> params = {};\n        " + codePaginate + codeFilter + " " + codeSearch + "\n        return ApiClient.dio\n            " + (e.method == 'GET' ? ".get('" + bindParams(e.path, e.params, e.isMock && e.isList) + "', queryParameters: params)" : ".post('" + bindParams(e.path, e.params, e.isMock && e.isList) + "', data: params)") + "\n            .then((value) => ApiResponse(\n                  " + model.name + ".listFromJson(value.data['data']),\n                  meta: MetaPage.fromJson(value.data['meta']),\n                ))\n            .catchError((error) => ApiResponse(<" + model.name + ">[], error: error));\n      }\n";
        }
        if (model && !e.isList) {
            var codePaginate = e.hasPaginate && !e.isMock ? 'params[\'page\'] = page;' : '';
            var codeSearch = e.hasSearch ? 'if (search != null) { params[\'search\'] = search; }' : '';
            var codeFilter = e.hasFilter ? 'if (filters != null) { params.addAll(params); }' : '';
            return "static Future<ApiResponse<" + model.name + ">> " + e.name + "(" + getParamsApiFunction(e) + ") {\n        final Map<String, dynamic> params = {};\n        " + codePaginate + codeFilter + " " + codeSearch + "\n        return ApiClient.dio\n            " + (e.method == 'GET' ? ".get('" + bindParams(e.path, e.params, e.isMock && e.isList) + "', queryParameters: params)" : ".post('" + bindParams(e.path, e.params, e.isMock && e.isList) + "', data: params)") + "\n            .then((value) => ApiResponse(\n                  " + model.name + ".fromJson(value.data['data']),\n                  meta: MetaPage.fromJson(value.data['meta']),\n                ))\n            .catchError((error) => ApiResponse(<" + model.name + ">[], error: error));\n      }\n";
        }
    }).join('\n') + "\n}\n";
}
function bindParams(path, params, hasPaginate) {
    if (params === void 0) { params = []; }
    if (hasPaginate === void 0) { hasPaginate = false; }
    // console.log(`bindParams `, [...params])
    var paramsInPath = params.filter(function (e) { return e.place == 'in-path'; });
    var result = path;
    if (hasPaginate) {
        result += "/page/:page";
        paramsInPath.push({ name: 'page', type: 'int', place: 'in-path' });
    }
    // console.log({paramsInPath})
    for (var _i = 0, paramsInPath_1 = paramsInPath; _i < paramsInPath_1.length; _i++) {
        var param = paramsInPath_1[_i];
        // console.log({param: result.split(`/:${param.name}`)})
        result = result.split("/:" + param.name).join("/$" + param.name);
    }
    // console.log({result})
    return result;
}
function getParamsApiFunction(e) {
    var _a, _b;
    var res = (_b = (_a = e.params) === null || _a === void 0 ? void 0 : _a.map(function (e) { return "required " + e.type + " " + e.name; })) !== null && _b !== void 0 ? _b : [];
    if (e.isList) {
        if (e.hasSearch)
            res.push('String? search,');
        if (e.hasPaginate)
            res.push('int page = 1,');
        if (e.hasFilter)
            res.push('Map<String, dynamic>? filters,');
    }
    return res.length ? "{" + res.join('') + "}" : '';
}
export { generateCodeApiClient };
//# sourceMappingURL=generate_code_api_client.js.map