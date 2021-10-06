import _ from "lodash";
function generateKrakendListPaginate(path, json, serverUrls) {
    if (path === void 0) { path = ''; }
    if (serverUrls === void 0) { serverUrls = []; }
    console.log({ serverUrls: serverUrls });
    var res = [];
    var pages = Math.ceil(json.length / 10);
    for (var index = 0; index < pages; index++) {
        res.push({
            "endpoint": path + "/page/" + (index + 1),
            "backend": [
                {
                    "host": serverUrls
                }
            ],
            "extra_config": {
                "github.com/devopsfaith/krakend/proxy": {
                    "static": {
                        "strategy": "errored",
                        "data": {
                            "data": _.chunk(json, 10)[index],
                            "meta": {
                                currentPage: index + 1,
                                lastPage: pages,
                                total: json.length,
                            }
                        }
                    }
                }
            }
        });
    }
    return res;
}
export function generateKrakendList(json, func, paramsReplace, serverUrls) {
    if (paramsReplace === void 0) { paramsReplace = {}; }
    if (serverUrls === void 0) { serverUrls = []; }
    var res = [];
    var path = func.path;
    if (func.isMock) {
        path = path.replace('/page/:page', '');
    }
    if (path.includes(':id')) {
        for (var i = 0; i < json.length; i++) {
            if (json[i][0] == undefined)
                continue;
            var pathRes = path.replace(':id', "" + (i + 1));
            pathRes = pathRes.replace(':idCommand', json[i][0]['id']);
            res.push.apply(res, generateKrakendListPaginate(pathRes, json[i], serverUrls));
        }
    }
    else {
        res.push.apply(res, generateKrakendListPaginate(path, json, serverUrls));
    }
    var resJson = JSON.stringify(res, null, 2);
    return resJson === null || resJson === void 0 ? void 0 : resJson.substr(1, (resJson === null || resJson === void 0 ? void 0 : resJson.length) - 2);
}
function generateKrakendItemCode(path, json, serverUrls) {
    if (path === void 0) { path = ''; }
    if (json === void 0) { json = {}; }
    if (serverUrls === void 0) { serverUrls = []; }
    return {
        "endpoint": path,
        "backend": [
            {
                "host": serverUrls
            }
        ],
        "extra_config": {
            "github.com/devopsfaith/krakend/proxy": {
                "static": {
                    "strategy": "errored",
                    "data": json
                }
            }
        }
    };
}
export function generateKrakendItem(json, func, paramsReplace, serverUrls) {
    if (paramsReplace === void 0) { paramsReplace = {}; }
    if (serverUrls === void 0) { serverUrls = []; }
    console.log({ func: func });
    var res = [];
    for (var i = 0; i < json.length; i++) {
        var pathResult = func.path;
        for (var key in paramsReplace) {
            if (paramsReplace[key] == 'page') {
                pathResult = pathResult.replace(key, "" + (i + 1));
            }
            else {
                try {
                    var value = json[i][0][paramsReplace[key]];
                    pathResult = pathResult.replace(key, "" + value);
                }
                catch (e) {
                    try {
                        var value = json[i][paramsReplace[key]];
                        pathResult = pathResult.replace(key, "" + value);
                    }
                    catch (e) {
                    }
                }
            }
        }
        if (json[i].length)
            res.push(generateKrakendItemCode(pathResult, json[i][0]), serverUrls);
        else
            res.push(generateKrakendItemCode(pathResult, json[i]), serverUrls);
    }
    var resJson = JSON.stringify(res, null, 2);
    return resJson === null || resJson === void 0 ? void 0 : resJson.substr(1, (resJson === null || resJson === void 0 ? void 0 : resJson.length) - 2);
}
//# sourceMappingURL=generate_krakend.js.map