import SwaggerParser from "@apidevtools/swagger-parser";
import {OpenAPIV3} from "openapi-types";

import yaml from "js-yaml";
import {getPropItemTypeFromSwaggerType, Model, PropItem} from "@/views/ModelEditor/RenderCodeLineType";
import _ from "lodash";
import {simpleTypes} from "@/views/ApiClient/generate_code_api_client";

function wrapName(name: string) {
    return _.camelCase(name);
}

function wrapType(type: string, isArray = false) {
    const _type = simpleTypes.includes(type) ? type : _.upperFirst(_.camelCase(type));

    if (isArray) {
        return `List<${_type}>`
    }

    return _type;
}

function getPropItemFromSwagger(name: string, prop: any, isArray: boolean = false): PropItem {
    if (prop['$ref']) {
        const _items = (prop['$ref'] as string).split('/');

        return {
            name: wrapName(name),
            desc: '',
            type: wrapType(_items[_items.length - 1], isArray),
            nullable: false,
            defaultValue: "",
        }
    } else {
        return {
            name: wrapName(name),
            type: wrapType(getPropItemTypeFromSwaggerType(prop['type']), isArray),
            defaultValue: "",
            desc: "",
            nullable: false,
        }
    }
}

export async function parseSwagger(text: string): Promise<{ models: Model[] }> {
    const resYaml = yaml.load(text);

    const res = await SwaggerParser.parse(resYaml as any);
    console.log({res})

    const yamlModels = Object.values(((res as any).components).schemas ?? {}) as OpenAPIV3.ArraySchemaObject[];

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
                    desc:'',
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

    return {
        models: [...yamlModels2, ...enums],
    }
}
