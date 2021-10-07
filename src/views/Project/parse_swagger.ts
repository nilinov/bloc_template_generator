import SwaggerParser from "@apidevtools/swagger-parser";
import {OpenAPIV3} from "openapi-types";

import yaml from "js-yaml";
import {getPropItemTypeFromSwaggerType, Model, PropItem} from "@/views/ModelEditor/RenderCodeLineType";

function getPropItemFromSwaggerTypeRef(prop: any): PropItem {
    if (prop['$ref']) {

        const _items = (prop['$ref'] as string).split('/');

        return {
            name: _items[_items.length - 1],
            desc: '',
            type: _items[_items.length - 1],
            nullable: false,
            defaultValue: "",
        }
    } else {
        return {
            type: getPropItemTypeFromSwaggerType(prop['type']),
            name: getPropItemTypeFromSwaggerType(prop['type']),
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
    const yamlModels2: Model[] = yamlModels.map(e => {
        const props: PropItem[] = [];

        const _props = Object.keys(e.properties ?? {}).map(key => {
            // @ts-ignore
            const prop = e.properties[key] as any;

            if (prop['type'] == "array") {
                props.push(getPropItemFromSwaggerTypeRef(prop['items']))
            } else if (prop['$ref']) {
                props.push(getPropItemFromSwaggerTypeRef(prop))
            }
        })

        // ( ?? []).map(e2 => ({
        //     name: e2.title ?? '',
        //     desc: e2.description ?? '',
        //     type: getPropItemTypeFromSwaggerType(e2.type ?? ''),
        //     defaultValue: e2.default,
        //     nullable: e2.nullable ?? false,
        // }))

        return {
            name: e.title ?? '',
            isEnum: !!e.enum,
            uuid: Math.random().toString(),
            desc: e.description ?? '',
            props: props
        }
    })

    return {
        models: yamlModels2,
    }
}