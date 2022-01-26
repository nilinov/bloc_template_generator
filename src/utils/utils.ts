import {BlocGetter, CodeLang, JsonData, Prop} from "./interfaces";
import * as _ from 'lodash';
import {getDefaultValue} from "./templates/bloc-default/bloc.default.tempalte";

export function getFullType(prop: Prop, params?: { noRequired?: boolean, lang: CodeLang }): string {

    if (params?.lang == 'ts') {
        if (prop.typeTemplate?.array) {
            return `${prop.typeName}[]`;
        } else if (prop.typeTemplate?.enum) {
            return `${prop.typeName}`;
        } else if (prop.typeTemplate?.double) {
            return `double`;
        } else if (prop.typeTemplate?.int) {
            return `integer`;
        } else if (prop.typeTemplate?.string) {
            return `string`;
        } else if (prop.typeTemplate?.map) {
            return `{[x: ${prop.typeTemplate.map.key}]: ${prop.typeTemplate.map.value}`
        } else if (prop.typeTemplate?.dynamic) {
            return `any`;
        }

        return `${prop.typeName}`;
    }

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
        const field = prop.jsonField ?? key;
        const nullable = prop.typeTemplate?.nullable ? '?' : '';

        if (prop.typeTemplate?.array || prop.typeName.indexOf('List<') == 0) {
            return `"${field}": '[' + (${key}${prop.typeTemplate?.nullable ? ' ?? []' : ''}).map((e) => e.toJson()).join(', ') + ']'`;
        } else if (prop.typeTemplate?.enum) {
            return `"${field}": ${_.camelCase(prop.typeName)}ToJson(${key})`;
        } else if (prop.typeTemplate?.double) {
            return `"${field}": ${key}`;
        } else if (prop.typeTemplate?.int) {
            return `"${field}": ${key}`;
        } else if (prop.typeTemplate?.string) {
            return `"${field}": ${key}`;
        } else if (prop.typeTemplate?.bool) {
            return `"${field}": ${key}`;
        } else if (prop.typeTemplate?.map) {
            return `"${field}": ${key}`;
        } else if (prop.typeTemplate?.class) {
            return `"${field}": ${key}${nullable}.toJson()`;
        } else if (prop.typeTemplate?.dynamic) {
            return `"${field}": ${key}`;
        } else if (prop.typeName) {
            if (prop.typeName == 'DateTime') {
                return `"${field}": ${key}${nullable}.toIso8601String()`;
            } else if (prop.typeName == 'bool') {
                return `"${field}": ${key}`;
            } else if (prop.typeTemplate?.array || prop.typeName.indexOf('List<') != -1) {
                return `"${field}": ${key}`;
            } else {
                return `"${field}": ${_.camelCase(prop.typeName)}ToJson(${key})`;
            }
        } else {
            console.error(`Не могу вывести свойство ${key}`, prop)
        }
    }).filter(e => e).join(', \n') + '\n}';
}

export function getPropNameFromList(prop: Prop) {
    if (prop.typeName?.indexOf('List<') != -1)
        return prop.typeName?.substr(5, prop.typeName?.length - 6);
    return prop.typeName;
}

export function fromMap(props: { [name: string]: Prop }, params?: { addAction?: Prop }) {
    console.log({props})

    const keys = Object.keys(props).map((key) => {
        const prop = props[key];
        const field = prop.jsonField ?? key;
        const isNullable = prop.typeTemplate?.nullable;
        const nullable = isNullable ? '?' : '';

        if (prop.typeTemplate?.array || prop.typeName.indexOf('List<') == 0) {
            return `${key}: ${getPropNameFromList(prop)}.listFromJson(json["${field}"])`;
        } else if (prop.typeTemplate?.enum) {
            return `${key}: ${key}FromJson(json["${field}"])`;
        } else if (prop.typeTemplate?.double) {
            if (isNullable)
                return `${key}: json["${field}"] != null ? (json["${field}"] as num).toDouble() : null`;

            return `${key}: (json["${field}"] as num).toDouble()`;
        } else if (prop.typeTemplate?.int) {
            return `${key}: json["${field}"] as int${nullable}`;
        } else if (prop.typeTemplate?.string) {
            return `${key}: json["${field}"] as String${nullable}`;
        } else if (prop.typeTemplate?.map) {
            return `${key}: ${key}FromJson(json["${field}"])`;
        } else if (prop.typeTemplate?.class) {
            return `${key}: ${prop.typeName}.fromJson(json["${field}"]) as ${prop.typeName}`;
        } else if (prop.typeTemplate?.dynamic) {
            return `${key}: json["${field}"]`;
        } else if (prop.typeName) {
            if (prop.typeName == 'DateTime') {
                if (isNullable)
                    return `${key}: json["${field}"] == null ? null : DateTime.parse(json["${field}"])`;

                return `${key}: DateTime.parse(json["${field}"])`;
            } else if (prop.typeName == 'bool') {
                return `${key}: json["${field}"] as bool${nullable}`;
            } else if (prop.typeTemplate?.array || prop.typeName.indexOf('List<') != -1) {
                return `${key}: ${getPropNameFromList(prop)}.listFromJson(json["${field}"])`;
            } else {
                return `${key}: ${_.camelCase(prop.typeName)}FromJson(json["${field}"])`;
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

export function getVariableAndType(variables: { [x: string]: Prop }, params?: { required?: boolean, noRequired?: boolean, addAction?: Prop, lang?: CodeLang }) {
    const lang: CodeLang = params?.lang ?? 'dart';
    const addActionName = params?.addAction?.name ?? ''
    let res = [];

    if (params?.lang == 'ts') {
        if (params?.required) {
            res = Object.keys(variables).map(variable => `\t  ${variable}: ${getFullType(variables[variable], {lang: lang})}\n`)
        } else if (params?.noRequired) {
            res = Object.keys(variables).map(variable => `\t ${variable}?: ${getFullType(variables[variable], {
                noRequired: true,
                lang: lang
            })}\n`)
        } else {
            res = Object.keys(variables).map(variable => {
                const noReq = variables[variable]?.typeTemplate?.nullable ? '?' : '';
                return `\t ${variable}${noReq}: ${getFullType(variables[variable], {
                    lang: lang,
                    noRequired: variables[variable]?.typeTemplate?.nullable,
                })}\n`;
            });
        }

        if (params?.addAction && addActionName) {
            res.push(`\t required ${getFullType(params?.addAction, {lang: lang})} ${addActionName},\n`);
        }

        return res.join('');
    }

    if (params?.required) {
        res = Object.keys(variables).map(variable => `\t required ${getFullType(variables[variable], {lang: lang})} ${variable},\n`)
    } else if (params?.noRequired) {
        res = Object.keys(variables).map(variable => `\t ${getFullType(variables[variable], {
            noRequired: true,
            lang: lang
        })} ${variable},\n`)
    } else {
        res = Object.keys(variables).map(variable => `\t${getFullType(variables[variable], {lang: lang})} ${variable},\n`);
    }

    if (params?.addAction && addActionName) {
        res.push(`\t required ${getFullType(params?.addAction, {lang: lang})} ${addActionName},\n`);
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

export const lowercaseFirstLetter = (string) =>string.charAt(0).toLowerCase() + string.slice(1);

export function getParamFunction(name = '', nullable = false, params?: { lang: CodeLang }) {
    const lang: CodeLang = params?.lang ?? 'dart';

    if (lang == 'dart') {
        if (nullable)
            return `\tthis.${name},\n`
        return `\t required this.${name},\n`;
    } else if (lang == 'ts') {
        if (nullable)
            return `${name}?`
        return `${name}`;
    }
}

export function getVariables(props: { [x: string]: Prop }, params?: { required: boolean, addAction?: Prop }) {
    let res = [];
    if (params?.required) {
        res = Object.keys(props).map(name => getParamFunction(name, props[name]?.typeTemplate?.nullable ?? false));
    } else {
        res = Object.keys(props).map(name => {
            return getParamFunction(name, props[name]?.typeTemplate?.nullable ?? true);
        });
    }

    if (params?.addAction?.name) {
        res.push(getParamFunction(params.addAction.name, false))
    }

    return `{ \n${res.join('')} }`;
}

function getNullableProp(prop: Prop, defValue: boolean = false) {
    return prop.typeTemplate?.nullable ?? false
}

export function getVariablesNames(props: { [x: string]: Prop }, params?: { required: boolean, addAction?: Prop, lang: CodeLang }) {
    const lang: CodeLang = params?.lang ?? 'dart';

    let res = [];
    if (params?.required) {
        res = Object.keys(props).map(name => getParamFunction(name, getNullableProp(props[name]), {lang: lang}));
    } else {
        res = Object.keys(props).map(name => {
            return getParamFunction(name, getNullableProp(props[name], true), {lang: lang});
        });
    }

    if (params?.addAction?.name) {
        res.push(getParamFunction(params.addAction.name, false, {lang: lang}))
    }

    return res;
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
