export function getFullType(prop) {
    if (prop.type?.array) {
        return `List<${prop.typeName}>`;
    }
    else if (prop.type?.enum) {
        return `${prop.typeName}`;
    }
    else if (prop.type?.double) {
        return `double`;
    }
    else if (prop.type?.int) {
        return `int`;
    }
    else if (prop.type?.string) {
        return `String`;
    }
    else if (prop.type?.map) {
        return `Map<${prop.type.map.key}, ${prop.type.map.value}>`;
    }
    else if (prop.type?.dynamic) {
        return `dynamic`;
    }
    return `${prop.typeName}`;
}
export function toMap(props) {
    return '{\n' + Object.keys(props).map((key) => {
        const prop = props[key];
        if (prop.type?.array) {
            return `${key}.toString()`;
        }
        else if (prop.type?.enum) {
            return `${key}.toString()`;
        }
        else if (prop.type?.double) {
            return `${key}`;
        }
        else if (prop.type?.int) {
            return `${key}`;
        }
        else if (prop.type?.string) {
            return `${key}`;
        }
        else if (prop.type?.map) {
            return `${key}.toString()`;
        }
    }).filter(e => e).join(', \n') + '\n}';
}
export function getGetters(getters) {
    return Object.keys(getters).map((key) => {
        const getter = getters[key];
        if (getter.params)
            return `${getter.returnType ?? ''} ${key}(${getter.params ?? ''}) => ${getter.content};`;
        return `${getter.returnType ?? ''} get ${key} => ${getter.content};`;
    }).join(' \n');
}
export function getFinalVariable(variable, type) {
    return `final ${getFullType(type)} ${variable};`;
}
export function getVariableAndType(variables) {
    return Object.keys(variables).map(variable => `\t${getFullType(variables[variable])} ${variable},\n`).join('');
}
export function getAllFinalVariables(variables) {
    return Object.keys(variables).map((variable) => '\t' + getFinalVariable(variable, variables[variable])).join('\n');
}
export const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).split('_').filter(e => e).join('_');
export const UpperFirstLetter = str => str[0].toUpperCase() + str.slice(1);
export function getVariables(props, params) {
    if (params?.required) {
        return `{ \n${Object.keys(props).map(name => `\t@required this.${name},\n`).join('')} }`;
    }
    else {
        return `{ \n${Object.keys(props).map(name => `\tthis.${name},\n`).join('')} }`;
    }
}
//# sourceMappingURL=utils.js.map