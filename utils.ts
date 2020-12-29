import {BlocGetter, Prop} from "./interfaces.js";

export function getFullType(prop: Prop): string {
    if (prop.type?.array) {
        return `List<${prop.typeName}>`;
    } else if (prop.type?.enum) {
        return `${prop.typeName}`;
    } else if (prop.type?.double) {
        return `double`;
    } else if (prop.type?.int) {
        return `int`;
    } else if (prop.type?.string) {
        return `String`;
    } else if (prop.type?.map) {
        return `Map<${prop.type.map.key}, ${prop.type.map.value}>`;
    } else if (prop.type?.dynamic) {
        return `dynamic`;
    }

    return `${prop.typeName}`;
}

export function toMap(props: { [name: string]: Prop }) {
    return '{\n' + Object.keys(props).map((key) => {
        const prop = props[key];
        if (prop.type?.array) {
            return `${key}.toString()`;
        } else if (prop.type?.enum) {
            return `${key}.toString()`;
        } else if (prop.type?.double) {
            return `${key}`;
        } else if (prop.type?.int) {
            return `${key}`;
        } else if (prop.type?.string) {
            return `${key}`;
        } else if (prop.type?.map) {
            return `${key}.toString()`;
        }
    }).filter(e => e).join(', \n') + '\n}';
}

export function getGetters(getters: { [x: string]: BlocGetter }) {
    return Object.keys(getters).map((key) => {
        const getter = getters[key];
        return `${getter.returnType ?? ''} ${key}(${getter.params ?? ''}) => ${getter.content};`
    }).join(' \n');
}

export function getFinalVariable(variable: string, type: Prop) {
    return `final ${getFullType(type)} ${variable};`
}

export function getVariableAndType(variables: { [x: string]: Prop }) {
    return Object.keys(variables).map(variable => `\t${getFullType(variables[variable])} ${variable},\n`).join('')
}

export function getAllFinalVariables(variables: { [x: string]: Prop }) {
    return Object.keys(variables).map((variable) => '\t' + getFinalVariable(variable, variables[variable])).join('\n');
}

export const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).split('_').filter(e => e).join('_');

export const UpperFirstLetter = str => str[0].toUpperCase() + str.slice(1);

export function getVariables(props: { [x: string]: Prop }, params?: { required: boolean }) {
    if (params?.required) {
        return `{ \n${Object.keys(props).map(name => `\t@required this.${name},\n`).join('')} }`;
    } else {
        return `{ \n${Object.keys(props).map(name => `\tthis.${name},\n`).join('')} }`;
    }
}