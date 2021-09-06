import {BlocGetter, Prop} from "./interfaces.js";

export function getFullType(prop: Prop): string {
    if (prop.typeTemplate?.array) {
        return `List<${prop.typeName}>`;
    } else if (prop.typeTemplate?.enum) {
        return `${prop.typeName}`;
    } else if (prop.typeTemplate?.double) {
        return `double`;
    } else if (prop.typeTemplate?.int) {
        return `int`;
    } else if (prop.typeTemplate?.string) {
        return `String`;
    } else if (prop.typeTemplate?.map) {
        return `Map<${prop.typeTemplate.map.key}, ${prop.typeTemplate.map.value}>`;
    } else if (prop.typeTemplate?.dynamic) {
        return `dynamic`;
    }

    return `${prop.typeName}`;
}

export function toMap(props: { [name: string]: Prop }) {
    return '{\n' + Object.keys(props).map((key) => {
        const prop = props[key];
        if (prop.typeTemplate?.array) {
            return `${key}.toString()`;
        } else if (prop.typeTemplate?.enum) {
            return `${key}.toString()`;
        } else if (prop.typeTemplate?.double) {
            return `${key}`;
        } else if (prop.typeTemplate?.int) {
            return `${key}`;
        } else if (prop.typeTemplate?.string) {
            return `${key}`;
        } else if (prop.typeTemplate?.map) {
            return `${key}.toString()`;
        }
    }).filter(e => e).join(', \n') + '\n}';
}

export function getGetters(getters: { [x: string]: BlocGetter }) {
    return Object.keys(getters).map((key) => {
        const getter = getters[key];
        if (getter.params)
            return `${getter.returnType ?? ''} ${key}(${getter.params ?? ''}) => ${getter.content};`
        return `${getter.returnType ?? ''} get ${key} => ${getter.content};`
    }).join(' \n');
}

export function getFinalVariable(variable: string, type: Prop) {
    return `final ${getFullType(type)} ${variable};`
}

export function getVariableAndType(variables: { [x: string]: Prop }) {
    return Object.keys(variables).map(variable => `\t${getFullType(variables[variable])} ${variable},\n`).join('')
}

export function getVariableAndTypeFunction(variables: { [x: string]: Prop }) {
    return Object.keys(variables).map(variable => `\t required ${getFullType(variables[variable])} ${variable},\n`).join('')
}

export function getAllFinalVariables(variables: { [x: string]: Prop }) {
    return Object.keys(variables).map((variable) => '\t' + getFinalVariable(variable, variables[variable])).join('\n');
}

export const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).split('_').filter(e => e).join('_');

export const UpperFirstLetter = (str: string) => str[0].toUpperCase() + str.slice(1);

export function getVariables(props: { [x: string]: Prop }, params?: { required: boolean }) {
    if (params?.required) {
        return `{ \n${Object.keys(props).map(name => `\t@required this.${name},\n`).join('')} }`;
    } else {
        return `{ \n${Object.keys(props).map(name => `\tthis.${name},\n`).join('')} }`;
    }
}