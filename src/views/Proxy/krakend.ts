import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";

function wrapPathParams(path: string) {
    return path.split('/').map(e => e[0] == ':' ? `{${e.substr(1)}}` : e).join('/').replace('/api', '');
}

export function krakend(fileName: string, krakenApiPrefix: string, host: string, functions: ApiFunction[], props: {krakenForeignApiPrefix: string, roles: string}) {
    let params = ``;

    params += `"querystring_params": [ "*" ],\n`


    return functions.map(api => `
{
  "endpoint": "${props.krakenForeignApiPrefix}${wrapPathParams(api.path)}",
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
  ],
  "extra_config": {
    "github.com/devopsfaith/krakend-jose/validator": {
        "alg": "RS256",
        "jwk-url": "{{ .keycloak_jwk_url_megastar }}",
        "roles": [ ${props.roles} ],
        "roles_key": "roles"
    }
  }
}`).join(',\n')
}