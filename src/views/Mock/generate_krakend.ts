import _ from "lodash";
import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";

function generateKrakendListPaginate(path = '', json: any, serverUrls: string[] = []) {
    console.log({serverUrls})

    let res = [];

    const pages = Math.ceil(json.length / 10)
    for (let index = 0; index < pages; index++) {

        res.push({
            "endpoint": `${path}/page/${index + 1}`,
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

export function generateKrakendList(json: any[], func: ApiFunction, paramsReplace: { [x: string]: string } = {}, serverUrls: string[] = []) {
    let res = [];

    let path = func.path;

    if (func.isMock) {
        path = path.replace('/page/:page', '');
    }

    if (path.includes(':id')) {
        for (let i = 0; i < json.length; i++) {
            if (json[i][0] == undefined) continue;

            let pathRes = path.replace(':id', `${i + 1}`);
            pathRes = pathRes.replace(':idCommand', json[i][0]['id']);

            res.push(...generateKrakendListPaginate(pathRes, json[i], serverUrls));
        }
    } else {
        res.push(...generateKrakendListPaginate(path, json, serverUrls));
    }

    const resJson = JSON.stringify(res, null, 2);

    return resJson?.substr(1, resJson?.length - 2);
}

function generateKrakendItemCode(path = '', json = {}, serverUrls: string[] = []) {
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
    }
}

export function generateKrakendItem(json: any[], func: ApiFunction, paramsReplace: { [x: string]: string } = {}, serverUrls: string[] = []) {
    console.log({func})

    let res = [];

    for (let i = 0; i < json.length; i++) {
        let pathResult = func.path
        for (const key in paramsReplace) {
            if (paramsReplace[key] == 'page') {
                pathResult = pathResult.replace(key, `${i + 1}`);
            } else {
                try {
                    const value = json[i][0][paramsReplace[key]];
                    pathResult = pathResult.replace(key, `${value}`);
                } catch (e) {
                    try {
                        const value = json[i][paramsReplace[key]];
                        pathResult = pathResult.replace(key, `${value}`);
                    } catch (e) {

                    }
                }
            }
        }

        if (json[i].length)
            res.push(generateKrakendItemCode(pathResult, json[i][0]), serverUrls)
        else
            res.push(generateKrakendItemCode(pathResult, json[i]), serverUrls)
    }

    const resJson = JSON.stringify(res, null, 2);

    return resJson?.substr(1, resJson?.length - 2);
}