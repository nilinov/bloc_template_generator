import _ from "lodash";
export function generateKrakendList(json, func) {
    var pages = Math.ceil(json.length / 10);
    var res = [];
    for (var i = 0; i < pages; i++) {
        res.push({
            "endpoint": func.path + "/page/" + (i + 1),
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
                            "data": _.chunk(json, 10)[i],
                            "meta": {
                                currentPage: i + 1,
                                lastPage: pages,
                                total: json.length,
                            }
                        }
                    }
                }
            }
        });
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