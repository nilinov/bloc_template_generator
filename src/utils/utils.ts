import {BlocGetter, JsonData, Prop} from "./interfaces.js";
import * as _ from 'lodash';
import {getDefaultValue} from "./templates/bloc-default/bloc.default.tempalte";

export function getFullType(prop: Prop, params?: { noRequired?: boolean }): string {
    const afterNoRequired = params?.noRequired ? '?' : '';

    if (prop.typeTemplate?.array) {
        return `List<${prop.typeName}>${afterNoRequired}`;
    } else if (prop.typeTemplate?.enum) {
        return `${prop.typeName}${afterNoRequired}`;
    } else if (prop.typeTemplate?.double) {
        return `double${afterNoRequired}`;
    } else if (prop.typeTemplate?.int) {
        return `int${afterNoRequired}`;
    } else if (prop.typeTemplate?.string) {
        return `String${afterNoRequired}`;
    } else if (prop.typeTemplate?.map) {
        return `Map<${prop.typeTemplate.map.key}, ${prop.typeTemplate.map.value}>`;
    } else if (prop.typeTemplate?.dynamic) {
        return `dynamic`;
    }

    return `${prop.typeName}${afterNoRequired}`;
}

export function toMap(props: { [name: string]: Prop }) {
    console.log(`toMap()`, props)

    return '{\n' + Object.keys(props).map((key) => {
        const prop = props[key];
        const nullable = prop.typeTemplate?.nullable ? '?' : '';

        if (prop.typeTemplate?.array) {
            return `"${key}": '[' + (${key}${prop.typeTemplate?.nullable ? ' ?? []' : ''}).map((e) => e.toJson()).join(', ') + ']'`;
        } else if (prop.typeTemplate?.enum) {
            return `"${key}": ${_.camelCase(prop.typeName)}ToJson(${key})`;
        } else if (prop.typeTemplate?.double) {
            return `"${key}": ${key}`;
        } else if (prop.typeTemplate?.int) {
            return `"${key}": ${key}`;
        } else if (prop.typeTemplate?.string) {
            return `"${key}": ${key}`;
        } else if (prop.typeTemplate?.bool) {
            return `"${key}": ${key}`;
        } else if (prop.typeTemplate?.map) {
            return `"${key}": ${key}`;
        } else if (prop.typeTemplate?.class) {
            return `"${key}": ${key}${nullable}.toJson()`;
        } else if (prop.typeTemplate?.dynamic) {
            return `"${key}": ${key}`;
        } else if (prop.typeName) {
            if (prop.typeName == 'DateTime') {
                return `"${key}": ${key}${nullable}.toIso8601String()`;
            } else if (prop.typeName == 'bool') {
                return `"${key}": ${key}`;
            } else if (prop.typeTemplate?.array || prop.typeName.indexOf('List<') != -1) {
                return `"${key}": ${key}`;
            } else {
                return `"${key}": ${_.camelCase(prop.typeName)}ToJson(${key})`;
            }
        } else {
            console.error(`Не могу вывести свойство ${key}`, prop)
        }
    }).filter(e => e).join(', \n') + '\n}';
}

export function getPropNameFromList(prop: Prop) {
    if (prop.typeName.indexOf('List<') != -1)
        return prop.typeName?.substr(5, prop.typeName?.length - 6);
    return prop.typeName;
}

export function fromMap(props: { [name: string]: Prop }, params?: { addAction?: Prop }) {
    console.log({props})

    const keys = Object.keys(props).map((key) => {
        const prop = props[key];
        const isNullable = prop.typeTemplate?.nullable;
        const nullable = isNullable ? '?' : '';

        if (prop.typeTemplate?.array) {
            return `${key}: ${getPropNameFromList(prop)}.listFromJson(json["${key}"])`;
        } else if (prop.typeTemplate?.enum) {
            return `${key}: ${key}FromJson(json["${key}"])`;
        } else if (prop.typeTemplate?.double) {
            if (isNullable)
                return `${key}: json["${key}"] != null ? (json["${key}"] as num).toDouble() : null`;

            return `${key}: (json["${key}"] as num).toDouble()`;
        } else if (prop.typeTemplate?.int) {
            return `${key}: json["${key}"] as int${nullable}`;
        } else if (prop.typeTemplate?.string) {
            return `${key}: json["${key}"] as String${nullable}`;
        } else if (prop.typeTemplate?.map) {
            return `${key}: ${key}FromJson(json["${key}"])`;
        } else if (prop.typeTemplate?.class) {
            return `${key}: ${prop.typeName}.fromJson(json["${key}"]) as ${prop.typeName}`;
        } else if (prop.typeTemplate?.dynamic) {
            return `${key}: json["${key}"]`;
        } else if (prop.typeName) {
            if (prop.typeName == 'DateTime') {
                if (isNullable)
                    return `${key}: json["${key}"] == null ? null : DateTime.parse(json["${key}"])`;

                return `${key}: DateTime.parse(json["${key}"])`;
            } else if (prop.typeName == 'bool') {
                return `${key}: json["${key}"] as bool${nullable}`;
            } else if (prop.typeTemplate?.array || prop.typeName.indexOf('List<') != -1) {
                return `${key}: ${getPropNameFromList(prop)}.listFromJson(json["${key}"])`;
            } else {
                return `${key}: ${_.camelCase(prop.typeName)}FromJson(json["${key}"])`;
            }
        } else {
            console.error(`Не могу вывести свойство ${key}`, prop)
        }
    })

    if (params?.addAction?.name) {
        keys.push(`${params.addAction.name}: json['${params.addAction.name}']`)
    }

    return keys.filter(e => e).join(', \n');
}

export function getGetters(getters: { [x: string]: BlocGetter }, params = {
    ApiCall: 'ApiCall',
    hasSearch: true,
    hasPaginate: true,
    hasFilter: true,
}) {
    return Object.keys(getters).filter(e => {
        if (!params.hasSearch && getters[e].tags?.includes('search')) return false;
        if (!params.hasPaginate && getters[e].tags?.includes('pagination')) return false;
        if (!params.hasFilter && getters[e].tags?.includes('filter')) return false;

        return true;
    }).map((key) => {
        const getter = getters[key];
        if (getter.params)
            return `${getter.returnType ?? ''} ${key}(${getter.params ?? ''}) => ${getter.content};`
        return `${getter.returnType ?? ''} get ${key} => ${getter.content};`
    }).join(' \n');
}

export function getFinalVariable(variable: string, type: Prop, params?: {}) {
    let nullable = '';
    if (type.typeTemplate?.nullable) {
        nullable = '?'
    }
    return `final ${getFullType(type)}${nullable} ${variable};`
}

export function getVariableAndType(variables: { [x: string]: Prop }, params?: { required?: boolean, noRequired?: boolean, addAction?: Prop }) {
    let res = [];

    if (params?.required) {
        res = Object.keys(variables).map(variable => `\t required ${getFullType(variables[variable])} ${variable},\n`)
    } else if (params?.noRequired) {
        res = Object.keys(variables).map(variable => `\t ${getFullType(variables[variable], {noRequired: true})} ${variable},\n`)
    } else {
        res = Object.keys(variables).map(variable => `\t${getFullType(variables[variable])} ${variable},\n`);
    }

    if (params?.addAction?.name) {
        res.push(`\t required ${getFullType(params?.addAction)} ${params?.addAction?.name},\n`);
    }

    return res.join('');
}

export function getAllFinalVariables(variables: { [x: string]: Prop }, params?: { addAction?: Prop }) {
    const res = Object.keys(variables).map((variable) => '\t' + getFinalVariable(variable, variables[variable]));

    if (params?.addAction?.name) {
        res.push('\t' + getFinalVariable(params?.addAction?.name, params?.addAction))
    }

    return res.join('\n');
}

export const camelToSnakeCase = (str: string = '  ') => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).split('_').filter(e => e).join('_');

export const UpperFirstLetter = (str: string = '  ') => str[0].toUpperCase() + str.slice(1);

export function getParamFunction(name = '', nullable = false) {
    if (nullable)
        return `\tthis.${name},\n`
    return `\t required this.${name},\n`;
}

export function getVariables(props: { [x: string]: Prop }, params?: { required: boolean, addAction?: Prop }) {
    let res = [];
    if (params?.required) {
        res = Object.keys(props).map(name => getParamFunction(name, props[name]?.typeTemplate?.nullable ?? false));
    } else {
        res = Object.keys(props).map(name => {
            console.log(`${name}`)
            return getParamFunction(name, props[name]?.typeTemplate?.nullable ?? true);
        });
    }

    if (params?.addAction?.name) {
        res.push(getParamFunction(params.addAction.name, false))
    }

    return `{ \n${res.join('')} }`;
}

export function getCopyWithParams(bloc: JsonData, params?: { addAction?: Prop }) {
    const res = Object.keys(bloc.state.props ?? {}).map(variable => `\t${variable}: ${variable} ?? this.${variable},\n`);

    if (params?.addAction?.name) {
        res.push(`\t ${params?.addAction?.name}: ${params?.addAction?.name},\n`)
    }

    return res.join('');
}

export function getClearWithParams(bloc: JsonData, params?: { addAction?: Prop }) {
    const res = Object.keys(bloc.state.props ?? {}).map(name => `\t ${name}: ${name} ? ${getDefaultValue(bloc, name)} : this.${name}, \n`);

    if (params?.addAction?.name) {
        res.push(`\t ${params?.addAction?.name}: ${params?.addAction?.name},\n`)
    }

    return res.join('');
}