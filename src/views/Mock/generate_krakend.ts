import _ from "lodash";
import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";

function generateKrakendListPaginate(path = '', json: any) {
    let res = [];

    const pages = Math.ceil(json.length / 10)
    for (let index = 0; index < pages; index++) {

        res.push({
            "endpoint": `${path}/page/${index + 1}`,
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

export function generateKrakendList(json: any[], func: ApiFunction) {

    let res = [];

    let path = func.path;

    if (func.isMock) {
        path = path.replace('/page/:page', '');
    }

    if (path.includes(':id')) {
        for (let i = 0; i < json.length; i++) {
            res.push(...generateKrakendListPaginate(path.replace(':id', `${i + 1}`), json[i]));
        }
    } else {
        res.push(...generateKrakendListPaginate(path, json));
    }

    const resJson = JSON.stringify(res, null, 2);

    return resJson?.substr(1, resJson?.length - 2);
}

export function generateKrakendItem(json: any[], func: ApiFunction) {
    let res = [];

    for (let i = 0; i < json.length; i++) {
        let path = func.path;

        for (const key in json[i]) {
            path = path.replace(`:${key}`, json[i][key])
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
        })
    }

    const resJson = JSON.stringify(res, null, 2);

    return resJson?.substr(1, resJson?.length - 2);
}