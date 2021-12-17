import {Model} from "@/views/ModelEditor/RenderCodeLineType";
import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";
import _ from "lodash";

export function generateSwaggerFile(allModels: Model[], allFunctions: ApiFunction[]) {
    console.log(`generateSwaggerFile`, allModels, allFunctions)

    const keysModels: { [x: string]: any } = {}

    for (let model of allModels) {
        keysModels[model.name] = getSchemaDescByClass(model, allModels);
    }

    const path: { [x: string]: any } = {}

    for (const func of allFunctions) {
        const model = allModels.find(model => model.uuid == func.modelUUID);

        const params = [];
        const paramsBody = [];

        for (const param of func.params ?? []) {
            if (param.place != 'body') {
                params.push({
                    name: param.name,
                    in: getSwaggerPlace(param.place),
                    required: true,
                    type: getPropName(getSwaggerType(param.type))
                })
            }
        }

        let localPath = func.path.split('/');

        if (func.hasPaginate && func.isMock) {
            localPath.push('page', ':page')
        }

        const resPath = func.path.split('/').map(e => e[0] === ':' ? `{${e.replace(':', '')}}` : e).join('/');

        console.log(`${resPath}`)

        for (const param of func.params ?? []) {
            if (param.place === 'body') {
                const model = allModels.find(e => e.name == param.type);
                const schema = model ? getSchemaLinkByClass(model, {isArray: false, paginate: false}) : {}

                paramsBody.push({
                    name: param.name,
                    in: 'body',
                    required: true,
                    "schema": schema,
                })
            }

        }

        path[resPath] = {
            "parameters": params,
            [func.method.toLowerCase()]: {
                "tags": [func.tag],
                "summary": func.desc,
                "responses": {
                    "200": {
                        "description": "Успешное выполнение запроса",
                        "schema": getSchemaLinkByClass(model, {isArray: func.isList, paginate: func.hasPaginate})
                    }
                },
            }
        };

        if (func.method.toLowerCase() != 'get') {
            path[resPath][func.method.toLowerCase()]["parameters"] = paramsBody;
        }
    }


    return JSON.stringify({
        "swagger": "2.0",
        "info": {
            "version": "1.0.0",
            "title": `Api documentation`,
            "description": ""
        },
        "host": "sample.com",
        "schemes": ["http"],
        "consumes": ["application/json"],
        "produces": ["application/json"],
        "paths": path,
        "definitions": keysModels
    }, null, 2);
}

function getSwaggerPlace(place: 'in-path' | 'query' | 'body') {
    switch (place) {
        case "query":
            return "query";
        case 'in-path':
            return 'path';
    }
    return place;
}

export function fromSwaggerPlace(place: 'path' | 'query' | 'body') {
    switch (place) {
        case "query":
            return "query";
        case 'path':
            return 'in-path';
    }
    return place;
}

function getSwaggerType(type: any) {
    switch (type) {
        case 'int':
            type = "integer";
            break;
        case 'datetime':
            type = "string";
            break;
        case 'double':
            type = "number";
            break;
        case 'bool':
            type = "boolean";
            break;
    }
    return type;
}

export function getSchemaDescByClass(model?: Model, allModels: Model[] = []) {
    console.log(`${model?.name}`)

    const props: { [x: string]: any } = {};

    for (const prop of model?.props ?? []) {
        const _name = getNameClassSingle(prop.name);
        const model = allModels.find(e => e.name == prop.type);
        const name = _.snakeCase(model?.name || _name);

        const isArray = name?.indexOf('List<') == 0;

        if (!model || !model?.isEnum) {

            let type: any = prop.type.toLowerCase();
            let isModel = false;

            if (model) {
                type = {"$ref": `#/definitions/${getNameClassSingle(model?.name ?? '')}`};
                isModel = true;
            }

            if (prop.type.indexOf('List<') == 0) {

                if (['int', 'String', 'bool'].find(e => prop.type.indexOf(e) != -1)) {
                    type = {
                        "type": "array",
                        "items": {
                            "type": `${getPropName(getNameClassSingle(prop.type ?? ''))}`
                        }
                    }

                    // return type;
                } else {
                    type = {
                        "type": "array",
                        "items": {
                            "$ref": `#/definitions/${getNameClassSingle(prop.type ?? '')}`
                        }
                    };
                }
                isModel = true;
            }
            type = getSwaggerType(type);
            if (isModel) {
                props[name] = type
            } else {
                props[name] = {
                    "description": prop?.desc,
                    "type": type,
                }
            }
        } else {
            props[name] = {
                "description": prop?.desc + `\n ${model?.props?.map(e => e.name)}`,
                "type": "string",
                "enum": model?.props?.map(e => e.name),
            }
        }
    }

    return {
        "type": "object",
        "description": model?.desc,
        "properties": props,
    }
}

function getPropName(name: string) {
    let _name = name;

    if (name?.indexOf('List<') == 0) _name = name?.substr(5, name?.length - 6)

    switch (_name) {
        case 'String':
            return 'string';
        case 'int':
            return 'integer';
        default:
            return _name;
    }
}

function getNameClassSingle(name: string) {
    if (name?.indexOf('List<') == 0) return name?.substr(5, name?.length - 6)

    return name;
}

export function getSchemaLinkByClass(model?: Model, {
    isArray,
    paginate
}: { isArray: boolean, paginate: boolean } = {isArray: false, paginate: false,}) {
    if (model?.isEnum) return {
        "type": "string",
        "enum": model.props.map(e => e.name),
    }

    let res = {};

    if (model && (model.name?.indexOf('List<') == 0 || isArray)) {
        if (['int', 'String', 'bool'].includes(model.name)) {
            res = {
                "type": "array",
                "items": {
                    "type": `${model.name}`
                }
            }
        } else {

            res = {
                "type": "array",
                "items": {
                    $ref: `#/definitions/${getPropName(getNameClassSingle(model.name ?? ''))}`
                }
            }
        }

        if (paginate) {
            res = wrapPaginate(res);
        }

        return res;
    }

    if (paginate) {
        return wrapPaginate({"$ref": `#/definitions/${model?.name}`})
    }

    return {"$ref": `#/definitions/${model?.name}`}
}

function wrapPaginate(obj: any) {
    return {
        "type": "object",
        "properties": {
            "data": obj,
            "meta": {
                "$ref": "#/definitions/PaginationMeta"
            }
        }
    }
}