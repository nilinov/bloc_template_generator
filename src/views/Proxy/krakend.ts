import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";

function wrapPathParams(path: string) {
    return path.split('/').map(e => e[0] == ':' ? `{${e.substr(1)}}` : e).join('/');
}

export function krakend(fileName: string, krakenApiPrefix: string, host: string, functions: ApiFunction[]) {
    let params = ``;

    params += `"querystring_params": [ "*" ],\n`


    return functions.map(api => `
{
  "endpoint": "${krakenApiPrefix}${wrapPathParams(api.path)}",
  "method": "${api.method.toUpperCase()}",
  "output_encoding": "no-op",
  "headers_to_pass": [ "*" ],
  ${params}
  "backend": [
    {
    "url_pattern": "${krakenApiPrefix}${wrapPathParams(api.path)}",
      "method": "${api.method.toUpperCase()}",
      "encoding": "no-op",
      "host": [ "${host}" ]
    }
  ]
}`).join(',\n')
}