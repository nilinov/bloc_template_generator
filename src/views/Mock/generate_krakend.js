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
export function generateKrakendList(json, func) {
    var res = [];
    var path = func.path;
    if (func.isMock) {
        path = path.replace('/page/:page', '');
    }
    if (path.includes(':id')) {
        for (var i = 0; i < json.length; i++) {
            res.push.apply(res, generateKrakendListPaginate(path.replace(':id', "" + (i + 1)), json[i]));
        }
    }
    else {
        res.push.apply(res, generateKrakendListPaginate(path, json));
    }
    var resJson = JSON.stringify(res, null, 2);
    return resJson === null || resJson === void 0 ? void 0 : resJson.substr(1, (resJson === null || resJson === void 0 ? void 0 : resJson.length) - 2);
}
export function generateKrakendItem(json, func) {
    var res = [];
    for (var i = 0; i < json.length; i++) {
        var path = func.path;
        for (var key in json[i]) {
            path = path.replace(":" + key, json[i][key]);
        }
        res.push({
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
                        "data": json[i]
                    }
                }
            }
        });
    }
    var resJson = JSON.stringify(res, null, 2);
    return resJson === null || resJson === void 0 ? void 0 : resJson.substr(1, (resJson === null || resJson === void 0 ? void 0 : resJson.length) - 2);
}
//# sourceMappingURL=generate_krakend.js.map