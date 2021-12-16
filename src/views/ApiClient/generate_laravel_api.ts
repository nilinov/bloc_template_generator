import {Model} from "@/views/ModelEditor/RenderCodeLineType";
import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";
import {getSchemaDescByClass} from "@/views/ApiClient/generate_swagger_file";

export function generateLaravelApi(allModels: Model[], allFunctions: ApiFunction[]) {
    console.log(`generateLaravelApi`, allModels, allFunctions)

    const keysModels: { [x: string]: any } = {}

    for (let model of allModels) {
        keysModels[model.name] = getSchemaDescByClass(model, allModels);
    }

    const path: { [x: string]: any } = {}

    for (const func of allFunctions) {
        const model = allModels.find(model => model.uuid == func.modelUUID);

        console.log({func})

        // const params = [];
        const paramsBody = [];

        // for (const param of func.params ?? []) {
        //     if (param.place != 'body') {
        //         params.push({
        //             name: param.name,
        //             in: getSwaggerPlace(param.place),
        //             required: true,
        //             type: getSwaggerType(param.type)
        //         })
        //     }
        // }

        let localPath = func.path.split('/');

        if (func.hasPaginate && func.isMock) {
            localPath.push('page', ':page')
        }

        // path[func.path.split('/').map(e => e[0] === ':' ? `{${e.replace(':', '')}}` : e).join('/')] = {
        //     "parameters": params,
        //     [func.method.toLowerCase()]: {
        //         "summary": func.desc,
        //         "responses": {
        //             "200": {
        //                 "description": "Успешное выполнение запроса",
        //                 "schema": getSchemaLinkByClass(model)
        //             }
        //         },
        //     }
        // }
    }


    function getRoute(func: ApiFunction) {
        const model = allModels.find(model => model.uuid == func.modelUUID);

        return `Route::${func.method}('${func.path}', [App\\Http\\Controllers\\${func.tag ?? model?.name ?? func.name}Controller::class, '${func.name}']);`

    }

    return `<?php

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

${allFunctions.map(e => getRoute(e)).join('\n\n')}


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
`
}

