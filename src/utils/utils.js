export function getFullType(prop, params) {
    var _a, _b, _c, _d, _e, _f, _g;
    const afterNoRequired = (params === null || params === void 0 ? void 0 : params.noRequired) ? '?' : '';
    if ((_a = prop.typeTemplate) === null || _a === void 0 ? void 0 : _a.array) {
        return `List<${prop.typeName}>${afterNoRequired}`;
    }
    else if ((_b = prop.typeTemplate) === null || _b === void 0 ? void 0 : _b.enum) {
        return `${prop.typeName}${afterNoRequired}`;
    }
    else if ((_c = prop.typeTemplate) === null || _c === void 0 ? void 0 : _c.double) {
        return `double${afterNoRequired}`;
    }
    else if ((_d = prop.typeTemplate) === null || _d === void 0 ? void 0 : _d.int) {
        return `int${afterNoRequired}`;
    }
    else if ((_e = prop.typeTemplate) === null || _e === void 0 ? void 0 : _e.string) {
        return `String${afterNoRequired}`;
    }
    else if ((_f = prop.typeTemplate) === null || _f === void 0 ? void 0 : _f.map) {
        return `Map<${prop.typeTemplate.map.key}, ${prop.typeTemplate.map.value}>`;
    }
    else if ((_g = prop.typeTemplate) === null || _g === void 0 ? void 0 : _g.dynamic) {
        return `dynamic`;
    }
    return `${prop.typeName}${afterNoRequired}`;
}
export function toMap(props) {
    return '{\n' + Object.keys(props).map((key) => {
        var _a, _b, _c, _d, _e, _f;
        const prop = props[key];
        if ((_a = prop.typeTemplate) === null || _a === void 0 ? void 0 : _a.array) {
            return `${key}.toString()`;
        }
        else if ((_b = prop.typeTemplate) === null || _b === void 0 ? void 0 : _b.enum) {
            return `${key}.toString()`;
        }
        else if ((_c = prop.typeTemplate) === null || _c === void 0 ? void 0 : _c.double) {
            return `${key}`;
        }
        else if ((_d = prop.typeTemplate) === null || _d === void 0 ? void 0 : _d.int) {
            return `${key}`;
        }
        else if ((_e = prop.typeTemplate) === null || _e === void 0 ? void 0 : _e.string) {
            return `${key}`;
        }
        else if ((_f = prop.typeTemplate) === null || _f === void 0 ? void 0 : _f.map) {
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
export function getFinalVariable(variable, type, params) {
    var _a;
    let nullable = '';
    if ((_a = type.typeTemplate) === null || _a === void 0 ? void 0 : _a.nullable) {
        nullable = '?';
    }
    return `final ${getFullType(type)}${nullable} ${variable};`;
}
export function getVariableAndType(variables, params) {
    var _a;
    let res = [];
    if (params === null || params === void 0 ? void 0 : params.required) {
        res = Object.keys(variables).map(variable => `\t required ${getFullType(variables[variable])} ${variable},\n`);
    }
    else if (params === null || params === void 0 ? void 0 : params.noRequired) {
        res = Object.keys(variables).map(variable => `\t ${getFullType(variables[variable], { noRequired: true })} ${variable},\n`);
    }
    else {
        res = Object.keys(variables).map(variable => `\t${getFullType(variables[variable])} ${variable},\n`);
    }
    if (params === null || params === void 0 ? void 0 : params.addAction) {
        res.push(`\t required ${getFullType(params === null || params === void 0 ? void 0 : params.addAction)} ${(_a = params === null || params === void 0 ? void 0 : params.addAction) === null || _a === void 0 ? void 0 : _a.name},\n`);
    }
    return res.join('');
}
export function getAllFinalVariables(variables, params) {
    var _a;
    const res = Object.keys(variables).map((variable) => '\t' + getFinalVariable(variable, variables[variable]));
    if (params === null || params === void 0 ? void 0 : params.addAction) {
        res.push('\t' + getFinalVariable((_a = params === null || params === void 0 ? void 0 : params.addAction) === null || _a === void 0 ? void 0 : _a.name, params === null || params === void 0 ? void 0 : params.addAction));
    }
    return res.join('\n');
}
export const camelToSnakeCase = (str = '  ') => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).split('_').filter(e => e).join('_');
export const UpperFirstLetter = (str = '  ') => str[0].toUpperCase() + str.slice(1);
function getParamFunction(name = '', nullable = false) {
    if (nullable)
        return `\tthis.${name},\n`;
    return `\t required this.${name},\n`;
}
export function getVariables(props, params) {
    let res = [];
    if (params === null || params === void 0 ? void 0 : params.required) {
        res = Object.keys(props).map(name => { var _a, _b, _c; return getParamFunction(name, (_c = (_b = (_a = props[name]) === null || _a === void 0 ? void 0 : _a.typeTemplate) === null || _b === void 0 ? void 0 : _b.nullable) !== null && _c !== void 0 ? _c : false); });
    }
    else {
        res = Object.keys(props).map(name => {
            var _a, _b, _c;
            console.log(`${name}`);
            return getParamFunction(name, (_c = (_b = (_a = props[name]) === null || _a === void 0 ? void 0 : _a.typeTemplate) === null || _b === void 0 ? void 0 : _b.nullable) !== null && _c !== void 0 ? _c : true);
        });
    }
    if (params === null || params === void 0 ? void 0 : params.addAction) {
        res.push(getParamFunction(params.addAction.name, false));
    }
    return `{ \n${res.join('')} }`;
}
export function getCopyWithParams(bloc, params) {
    var _a, _b, _c;
    const res = Object.keys((_a = bloc.state.props) !== null && _a !== void 0 ? _a : {}).map(variable => `\t${variable}: ${variable} ?? this.${variable},\n`);
    if (params === null || params === void 0 ? void 0 : params.addAction) {
        res.push(`\t ${(_b = params === null || params === void 0 ? void 0 : params.addAction) === null || _b === void 0 ? void 0 : _b.name}: ${(_c = params === null || params === void 0 ? void 0 : params.addAction) === null || _c === void 0 ? void 0 : _c.name},\n`);
    }
    return res.join('');
}
