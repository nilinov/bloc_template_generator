export function getFullType(prop) {
    var _a, _b, _c, _d, _e, _f, _g;
    if ((_a = prop.type) === null || _a === void 0 ? void 0 : _a.array) {
        return `List<${prop.typeName}>`;
    }
    else if ((_b = prop.type) === null || _b === void 0 ? void 0 : _b.enum) {
        return `${prop.typeName}`;
    }
    else if ((_c = prop.type) === null || _c === void 0 ? void 0 : _c.double) {
        return `double`;
    }
    else if ((_d = prop.type) === null || _d === void 0 ? void 0 : _d.int) {
        return `int`;
    }
    else if ((_e = prop.type) === null || _e === void 0 ? void 0 : _e.string) {
        return `String`;
    }
    else if ((_f = prop.type) === null || _f === void 0 ? void 0 : _f.map) {
        return `Map<${prop.type.map.key}, ${prop.type.map.value}>`;
    }
    else if ((_g = prop.type) === null || _g === void 0 ? void 0 : _g.dynamic) {
        return `dynamic`;
    }
    return `${prop.typeName}`;
}
export function toMap(props) {
    return '{\n' + Object.keys(props).map((key) => {
        var _a, _b, _c, _d, _e, _f;
        const prop = props[key];
        if ((_a = prop.type) === null || _a === void 0 ? void 0 : _a.array) {
            return `${key}.toString()`;
        }
        else if ((_b = prop.type) === null || _b === void 0 ? void 0 : _b.enum) {
            return `${key}.toString()`;
        }
        else if ((_c = prop.type) === null || _c === void 0 ? void 0 : _c.double) {
            return `${key}`;
        }
        else if ((_d = prop.type) === null || _d === void 0 ? void 0 : _d.int) {
            return `${key}`;
        }
        else if ((_e = prop.type) === null || _e === void 0 ? void 0 : _e.string) {
            return `${key}`;
        }
        else if ((_f = prop.type) === null || _f === void 0 ? void 0 : _f.map) {
            return `${key}.toString()`;
        }
    }).filter(e => e).join(', \n') + '\n}';
}
export function getGetters(getters) {
    return Object.keys(getters).map((key) => {
        var _a, _b, _c;
        const getter = getters[key];
        if (getter.params)
            return `${(_a = getter.returnType) !== null && _a !== void 0 ? _a : ''} ${key}(${(_b = getter.params) !== null && _b !== void 0 ? _b : ''}) => ${getter.content};`;
        return `${(_c = getter.returnType) !== null && _c !== void 0 ? _c : ''} get ${key} => ${getter.content};`;
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
    if (params === null || params === void 0 ? void 0 : params.required) {
        return `{ \n${Object.keys(props).map(name => `\t@required this.${name},\n`).join('')} }`;
    }
    else {
        return `{ \n${Object.keys(props).map(name => `\tthis.${name},\n`).join('')} }`;
    }
}
