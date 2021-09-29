import {Model} from "@/views/ModelEditor/RenderCodeLineType";
import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";

export function generateSwaggerFile(allModels: Model[], allFunctions: ApiFunction[]) {
    const keysModels: { [x: string]: any } = {}

    for (let model of allModels) {
        keysModels[model.name] = getSchemaDescByClass(model, allModels);
    }

    const path: {[x: string]: any} = {}

    for (const func of allFunctions) {
        const model = allModels.find(model => model.uuid == func.modelUUID);

        path[func.path.split('/').map(e => e[0] === ':' ? `{${e.replace(':', '')}}` : e).join('/')] = {
            "get": {
                "summary": `function ${func.name}`,
                "responses": {
                    "200": {
                        "description": "",
                        "schema": getSchemaLinkByClass(model)
                    }
                },
            }
        }
    }


    return JSON.stringify({
        "swagger": "2.0",
        "info": {
            "version": "1.0.0",
            "title": "Mad Team swagger",
            "description": ""
        },
        "host": "ovz5.j1121565.m719m.vps.myjino.ru",
        "schemes": ["http"],
        "consumes": ["application/json"],
        "produces": ["application/json"],
        "paths": path,
        "definitions": keysModels
    }, null, 2);
}

function getSchemaDescByClass(model?: Model, allModels: Model[] = []) {
    const props: { [x: string]: any } = {};
    console.log({props})

    for (const prop of model?.props ?? []) {
        const _name = getNameClassSingle(prop.name);
        const model = allModels.find(e => e.name == prop.type);
        const name = model?.name || _name;

        const isArray = name?.indexOf('List<') == 0;

        if (!model || !model?.isEnum) {

            let type: any = prop.type.toLowerCase();
            let isModel = false;

            if (model) {
                type = {"$ref": `#/definitions/${getNameClassSingle(model?.name ?? '')}`};
                isModel = true;
            }

            if (prop.type.indexOf('List<') == 0) {
                type = {"$ref": `#/definitions/${getNameClassSingle(prop.type ?? '')}`};
                isModel = true;
            }

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
            if (isModel) {
                props[name] = type
            } else {
                props[name] = {
                    "type": type,
                }
            }
        }
    }

    return {
        "type": "object",
        "properties": props,
    }
}

function getNameClassSingle(name: string) {
    if (name?.indexOf('List<') == 0) return name?.substr(5, name?.length - 6)

    return name;
}

function getSchemaLinkByClass(model?: Model) {
    if (model?.isEnum) return {
        "type": "string",
        "enum": model.props.map(e => e.name),
    }

    if (model?.name?.indexOf('List<') == 0) {
        return {
            "type": "array",
            "items": `$ref: '#/definitions/${getNameClassSingle(model.name ?? '')}`
        }
    }

    return {"$ref": `#/definitions/${model?.name}`}
}
