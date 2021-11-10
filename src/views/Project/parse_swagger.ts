import SwaggerParser from "@apidevtools/swagger-parser";
import {OpenAPIV3} from "openapi-types";

import yaml from "js-yaml";
import {getPropItemTypeFromSwaggerType, Model, PropItem} from "@/views/ModelEditor/RenderCodeLineType";
import _ from "lodash";
import {ApiFunction, simpleTypes} from "@/views/ApiClient/generate_code_api_client";
import {fromSwaggerPlace} from "@/views/ApiClient/generate_swagger_file";

function wrapName(name: string) {
    return _.camelCase(name).split('Api').join('').split('Admin').join('').split('V1').join('');
}

function wrapType(type: string, isArray = false) {
    const _type = simpleTypes.includes(type) ? type : _.upperFirst(_.camelCase(type));

    if (isArray) {
        return `List<${_type}>`
    }

    return _type;
}

function getPropType(prop: any, isArray: boolean = false) {
    if (prop['$ref']) {
        const _items = (prop['$ref'] as string).split('/');

        return wrapType(_items[_items.length - 1], isArray);
    } else {
        return wrapType(getPropItemTypeFromSwaggerType(prop['type']), isArray)
    }
}

function getPropItemFromSwagger(name: string, prop: any, isArray: boolean = false): PropItem {
    return {
        name: wrapName(name),
        type: getPropType(prop, isArray),
        defaultValue: "",
        desc: "",
        nullable: false,
    }
}

function extractFunction(path: string, func: OpenAPIV3.OperationObject, props: { allModels: Model[], pathsItems: any[], method: string } = {allModels: [], pathsItems: [], method: 'GET'}) : ApiFunction {
    const name = wrapName(func.operationId ?? props.pathsItems[props.pathsItems.length - 1] ?? '');

    const response200 = ((func.responses[200] ?? func.responses['200']) as any)?.content?.['application/json']?.schema;
    let modelUUID: string = '';

    if (response200.hasOwnProperty('$ref')) {
        const _response200 = response200 as OpenAPIV3.ReferenceObject;
        modelUUID = props.allModels.find(e => e.name == getPropType(_response200))?.uuid ?? ''
    } else if (!response200.hasOwnProperty('$ref')) {
        console.error('Не найдена модель ', response200);
    }

    return {
        path: path ?? '',
        uuid: Math.random().toString(),
        desc: func.description ?? func.summary ?? '',
        params: func.parameters?.map((param: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject) => {
            if (!param.hasOwnProperty('$ref')) {
                const _params = param as OpenAPIV3.ParameterObject;
                const _type = getPropType(_params.schema);

                return ({
                    place: fromSwaggerPlace(_params.in as any),
                    name: _params.name,
                    type: _type,
                });
            } else {
                const _params = param as OpenAPIV3.ParameterObject & OpenAPIV3.ReferenceObject;
                const _type = getPropType(_params);

                return ({
                    place: fromSwaggerPlace(_params.in as any),
                    name: _params.name,
                    type: _type,
                });
            }
        }) ?? [],
        name: name,
        method: props.method as "GET" | "POST" | "PUT" | "DELETE",
        isMock: false,
        hasPaginate: !!func.parameters?.find((e) => (e as OpenAPIV3.ParameterObject).name == 'page'),
        hasSearch: !!func.parameters?.find((e) => (e as OpenAPIV3.ParameterObject).name == 'search'),
        hasFilter: !!func.parameters?.find((e) => ((e as OpenAPIV3.ParameterObject).name).indexOf('filter') != -1),
        modelUUID: modelUUID,
        isList: false,
    }
}

export async function parseSwagger(text: string, allModels: Model[] = []): Promise<{ models: Model[], functions: ApiFunction[] }> {
    const resYaml = yaml.load(text);

    const res = await SwaggerParser.parse(resYaml as any);
    console.log({res})

    const yamlModels = Object.values(((res as any).components).schemas ?? {}) as OpenAPIV3.ArraySchemaObject[];

    const apiFunctions: ApiFunction[] = []


    Object.keys(((res as any).paths) ?? {}).map((path) => {
        const pathObj = (res as any).paths[path];
        const pathsItems = path.split('/');

        if (pathObj.get) {
            const func = pathObj.get as OpenAPIV3.OperationObject;
            apiFunctions.push(extractFunction(path, func, {allModels: allModels, pathsItems: pathsItems, method: 'GET'}));
        }
        if (pathObj.post) {
            const func = pathObj.post as OpenAPIV3.OperationObject;
            apiFunctions.push(extractFunction(path, func, {allModels: allModels, pathsItems: pathsItems, method: "POST"}));
        }
        if (pathObj.put) {
            const func = pathObj.get as OpenAPIV3.OperationObject;
            apiFunctions.push(extractFunction(path, func, {allModels: allModels, pathsItems: pathsItems, method: "PUT"}));
        }
        if (pathObj.delete) {
            const func = pathObj.get as OpenAPIV3.OperationObject;
            apiFunctions.push(extractFunction(path, func, {allModels: allModels, pathsItems: pathsItems, method: "DELETE"}));
        }
    });

    console.log([...apiFunctions])

    return {
        models: parseSwaggerModels(yamlModels),
        functions: apiFunctions,
    }
}

function parseSwaggerModels(yamlModels: OpenAPIV3.ArraySchemaObject[]) {
    const enums: Model[] = [];

    const yamlModels2: Model[] = yamlModels.map(e => {
        const props: PropItem[] = [];

        Object.keys(e.properties ?? {}).map(key => {
            // @ts-ignore
            const prop = e.properties[key] as any;

            if (prop['enum']) {
                enums.push({
                    name: wrapType(key),
                    isEnum: true,
                    uuid: Math.random().toString(),
                    desc: prop['title'] ?? prop['desc'] ?? '',
                    props: prop['enum'].map((e1: string) => ({
                        name: wrapName(e1),
                        desc: '',
                        type: 'String',
                        nullable: false,
                        defaultValue: "",
                    })),
                })

                props.push({
                    name: wrapName(key),
                    type: wrapType(key),
                    desc: '',
                    nullable: false,
                    defaultValue: '',
                })
            } else {
                props.push(getPropItemFromSwagger(key, prop['items'] ?? prop, prop['type'] == "array"))
            }
        })

        return {
            name: e.title ?? '',
            isEnum: !!e.enum,
            uuid: Math.random().toString(),
            desc: e.description ?? '',
            props: [...props]
        }
    })

    return [...yamlModels2, ...enums];
}