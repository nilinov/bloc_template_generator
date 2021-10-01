import _ from "lodash";
function generateKrakendListPaginate(path, json) {
    if (path === void 0) { path = ''; }
    var res = [];
    var pages = Math.ceil(json.length / 10);
    for (var index = 0; index < pages; index++) {
        res.push({
            "endpoint": path + "/page/" + (index + 1),
            "backend": [
                {
                    "host": [
                        "http://ovz5.j1121565.m719m.vps.myjino.ru/"
                    ]
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
export function generateKrakendList(json, func, paramsReplace) {
    if (paramsReplace === void 0) { paramsReplace = {}; }
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
            res.push.apply(res, generateKrakendListPaginate(pathRes, json[i]));
        }
    }
    else {
        res.push.apply(res, generateKrakendListPaginate(path, json));
    }
    var resJson = JSON.stringify(res, null, 2);
    return resJson === null || resJson === void 0 ? void 0 : resJson.substr(1, (resJson === null || resJson === void 0 ? void 0 : resJson.length) - 2);
}
function generateKrakendItemCode(path, json) {
    if (path === void 0) { path = ''; }
    if (json === void 0) { json = {}; }
    return {
        "endpoint": path,
        "backend": [
            {
                "host": [
                    "http://ovz5.j1121565.m719m.vps.myjino.ru/"
                ]
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
export function generateKrakendItem(json, func, paramsReplace) {
    if (paramsReplace === void 0) { paramsReplace = {}; }
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
                }
            }
        }
        if (json[i].length)
            res.push(generateKrakendItemCode(pathResult, json[i][0]));
        else
            res.push(generateKrakendItemCode(pathResult, json[i]));
    }
    var resJson = JSON.stringify(res, null, 2);
    return resJson === null || resJson === void 0 ? void 0 : resJson.substr(1, (resJson === null || resJson === void 0 ? void 0 : resJson.length) - 2);
}
//# sourceMappingURL=generate_krakend.js.map