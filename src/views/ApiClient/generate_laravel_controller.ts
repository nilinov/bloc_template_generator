import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";
import {Model} from "@/views/ModelEditor/RenderCodeLineType";
import {camelCase} from "lodash";
import {getClassName} from "@/views/ModelEditor/LaravelSeederFactory.vue";

function getControllerMethod(func: ApiFunction, allModels: Model[] = []) {
    let request = 'Request $request'
    let content = ``
    const model = allModels.find(e => e.uuid == func.modelUUID)
    const className = getClassName(model?.name ?? '');
    const exemplarName = `\$${camelCase(model?.name)}`

    if (func.method == 'GET') {
        if (func.isList && !func.hasPaginate) {
            content = `$items = ${model?.name}::all()->values(); \n\n        return new ${model?.name}Collection($items);`
        }
        if (func.isList && func.hasPaginate) {
            content = `$items = ${model?.name}::orderBy('id','DESC')->paginate(10);

        return $items;`
        }
        if (!func.isList) {
            request = `Request $request, ${className} ${exemplarName}`
            content = `return new ${model?.name}Resource(${exemplarName});`
        }
    }

    if (func.method == 'POST') {
        if (!func.isList) {
            content = `if ($request->validate((new ${className}UpdateRequest())->rules())) {

            ${exemplarName} = new ${className}($request->input());

            ${exemplarName}->save();

            return new ${className}Resource(${exemplarName});
        }

        return false;`
        } else {
            content = `//TODO`
        }
    }

    if (func.method == 'DELETE') {
        if (!func.isList) {
            request = `Request $request, int $id`
            content = `${className}::destroy($id);

        return new ${className}();`
        } else {
            content = `//TODO`
        }
    }

    if (func.method == 'PUT') {
        if (!func.isList) {
            request = `Request $request, int $id`
            content = `if ($request->validate((new ${className}UpdateRequest())->rules())) {
            ${exemplarName} = ${className}::find($id);

            ${exemplarName}->update($request->input());

            return new ${className}Resource(${exemplarName});
        }
        return false;`
        } else {
            content = `//TODO`
        }
    }


    return `/**
     * @param \\Illuminate\\Http\\Request $request
     */
    public function ${func.name}(${request})
    {
        ${content}
    }`
}

export function generateLaravelController(functions: ApiFunction[], allModels: Model[] = []) {
    const tag = functions.length ? functions[0].tag : '';
    return `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;

class ${tag}BaseController extends ${tag}Controller
{
    ${functions.map(e => getControllerMethod(e, allModels)).join('\n\n    ')}
}
`
}
