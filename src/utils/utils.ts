import {BlocGetter, JsonData, Prop} from "./interfaces.js";

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

export function getFinalVariable(variable: string, type: Prop, params?: {}) {
    return `final ${getFullType(type)} ${variable};`
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

    if (params?.addAction) {
        res.push(`\t required ${getFullType(params?.addAction)} ${params?.addAction?.name},\n`);
    }

    return res.join('');
}

export function getAllFinalVariables(variables: { [x: string]: Prop }, params?: { addAction?: Prop }) {
    const res = Object.keys(variables).map((variable) => '\t' + getFinalVariable(variable, variables[variable]));

    if (params?.addAction) {
        res.push('\t' + getFinalVariable(params?.addAction?.name, params?.addAction))
    }

    return res.join('\n');
}

export const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).split('_').filter(e => e).join('_');

export const UpperFirstLetter = (str: string) => str[0].toUpperCase() + str.slice(1);

export function getVariables(props: { [x: string]: Prop }, params?: { required: boolean, addAction?: Prop }) {
    let res = [];
    if (params?.required) {
        res = Object.keys(props).map(name => `\t required this.${name},\n`);
    } else {
        res = Object.keys(props).map(name => `\tthis.${name},\n`);
    }

    if (params?.addAction) {
        res.push(`\t required this.${params.addAction.name},\n`)
    }

    return `{ \n${res.join('')} }`;
}

export function getCopyWithParams(bloc: JsonData, params?: { addAction?: Prop }) {
    const res = Object.keys(bloc.state.props ?? {}).map(variable => `\t${variable}: ${variable} ?? this.${variable},\n`);

    if (params?.addAction) {
        res.push(`\t ${params?.addAction?.name}: ${params?.addAction?.name},\n`)
    }

    return res.join('');
}