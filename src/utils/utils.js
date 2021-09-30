import * as _ from 'lodash';
import { getDefaultValue } from "./templates/bloc-default/bloc.default.tempalte";
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
    console.log(`toMap()`, props);
    return '{\n' + Object.keys(props).map((key) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const prop = props[key];
        const nullable = ((_a = prop.typeTemplate) === null || _a === void 0 ? void 0 : _a.nullable) ? '?' : '';
        if ((_b = prop.typeTemplate) === null || _b === void 0 ? void 0 : _b.array) {
            return `"${key}": '[' + (${key} ?? []).map((e) => e.toJson()).join(', ') + ']'`;
        }
        else if ((_c = prop.typeTemplate) === null || _c === void 0 ? void 0 : _c.enum) {
            return `"${key}": ${_.camelCase(prop.typeName)}ToJson(${key})`;
        }
        else if ((_d = prop.typeTemplate) === null || _d === void 0 ? void 0 : _d.double) {
            return `"${key}": ${key}`;
        }
        else if ((_e = prop.typeTemplate) === null || _e === void 0 ? void 0 : _e.int) {
            return `"${key}": ${key}`;
        }
        else if ((_f = prop.typeTemplate) === null || _f === void 0 ? void 0 : _f.string) {
            return `"${key}": ${key}`;
        }
        else if ((_g = prop.typeTemplate) === null || _g === void 0 ? void 0 : _g.bool) {
            return `"${key}": ${key}`;
        }
        else if ((_h = prop.typeTemplate) === null || _h === void 0 ? void 0 : _h.map) {
            return `"${key}": ${key}`;
        }
        else if ((_j = prop.typeTemplate) === null || _j === void 0 ? void 0 : _j.class) {
            return `"${key}": ${key}${nullable}.toJson()`;
        }
        else if ((_k = prop.typeTemplate) === null || _k === void 0 ? void 0 : _k.dynamic) {
            return `"${key}": ${key}`;
        }
        else if (prop.typeName) {
            if (prop.typeName == 'DateTime') {
                return `"${key}": ${key}.toIso8601String()`;
            }
            else if (prop.typeName == 'bool') {
                return `"${key}": ${key}`;
            }
            else if (((_l = prop.typeTemplate) === null || _l === void 0 ? void 0 : _l.array) || prop.typeName.indexOf('List<') != -1) {
                return `"${key}": ${key}`;
            }
            else {
                return `"${key}": ${_.camelCase(prop.typeName)}ToJson(${key})`;
            }
        }
        else {
            console.error(`Не могу вывести свойство ${key}`, prop);
        }
    }).filter(e => e).join(', \n') + '\n}';
}
export function getPropNameFromList(prop) {
    var _a, _b;
    return (_a = prop.typeName) === null || _a === void 0 ? void 0 : _a.substr(5, ((_b = prop.typeName) === null || _b === void 0 ? void 0 : _b.length) - 6);
}
export function fromMap(props, params) {
    var _a;
    console.log({ props });
    const keys = Object.keys(props).map((key) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const prop = props[key];
        const nullable = ((_a = prop.typeTemplate) === null || _a === void 0 ? void 0 : _a.nullable) ? '?' : '';
        if ((_b = prop.typeTemplate) === null || _b === void 0 ? void 0 : _b.array) {
            return `${key}: ${prop.typeName}.listFromJson(json["${key}"])`;
        }
        else if ((_c = prop.typeTemplate) === null || _c === void 0 ? void 0 : _c.enum) {
            return `${key}: ${key}FromJson(json["${key}"])`;
        }
        else if ((_d = prop.typeTemplate) === null || _d === void 0 ? void 0 : _d.double) {
            return `${key}: ${key} != null ? (json["${key}"] as num).toDouble() : null`;
        }
        else if ((_e = prop.typeTemplate) === null || _e === void 0 ? void 0 : _e.int) {
            return `${key}: json["${key}"] as int${nullable}`;
        }
        else if ((_f = prop.typeTemplate) === null || _f === void 0 ? void 0 : _f.string) {
            return `${key}: json["${key}"] as String${nullable}`;
        }
        else if ((_g = prop.typeTemplate) === null || _g === void 0 ? void 0 : _g.map) {
            return `${key}: ${key}FromJson(json["${key}"])`;
        }
        else if ((_h = prop.typeTemplate) === null || _h === void 0 ? void 0 : _h.class) {
            return `${key}: ${prop.typeName}.fromJson(json["${key}"]) as ${prop.typeName}`;
        }
        else if ((_j = prop.typeTemplate) === null || _j === void 0 ? void 0 : _j.dynamic) {
            return `${key}: json["${key}"]`;
        }
        else if (prop.typeName) {
            if (prop.typeName == 'DateTime') {
                return `${key}: DateTime.parse(json["${key}"])`;
            }
            else if (prop.typeName == 'bool') {
                return `${key}: json["${key}"] as bool${nullable}`;
            }
            else if (((_k = prop.typeTemplate) === null || _k === void 0 ? void 0 : _k.array) || prop.typeName.indexOf('List<') != -1) {
                return `${key}: ${prop.typeName}.listFromJson(json["${key}"])`;
            }
            else {
                return `${key}: ${_.camelCase(prop.typeName)}FromJson(json["${key}"])`;
            }
        }
        else {
            console.error(`Не могу вывести свойство ${key}`, prop);
        }
    });
    if ((_a = params === null || params === void 0 ? void 0 : params.addAction) === null || _a === void 0 ? void 0 : _a.name) {
        keys.push(`${params.addAction.name}: json['${params.addAction.name}']`);
    }
    return keys.filter(e => e).join(', \n');
}
export function getGetters(getters, params = {
    ApiCall: 'ApiCall',
    hasSearch: true,
    hasPaginate: true,
    hasFilter: true,
}) {
    return Object.keys(getters).filter(e => {
        var _a, _b, _c;
        if (!params.hasSearch && ((_a = getters[e].tags) === null || _a === void 0 ? void 0 : _a.includes('search')))
            return false;
        if (!params.hasPaginate && ((_b = getters[e].tags) === null || _b === void 0 ? void 0 : _b.includes('pagination')))
            return false;
        if (!params.hasFilter && ((_c = getters[e].tags) === null || _c === void 0 ? void 0 : _c.includes('filter')))
            return false;
        return true;
    }).map((key) => {
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
    var _a, _b;
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
    if ((_a = params === null || params === void 0 ? void 0 : params.addAction) === null || _a === void 0 ? void 0 : _a.name) {
        res.push(`\t required ${getFullType(params === null || params === void 0 ? void 0 : params.addAction)} ${(_b = params === null || params === void 0 ? void 0 : params.addAction) === null || _b === void 0 ? void 0 : _b.name},\n`);
    }
    return res.join('');
}
export function getAllFinalVariables(variables, params) {
    var _a, _b;
    const res = Object.keys(variables).map((variable) => '\t' + getFinalVariable(variable, variables[variable]));
    if ((_a = params === null || params === void 0 ? void 0 : params.addAction) === null || _a === void 0 ? void 0 : _a.name) {
        res.push('\t' + getFinalVariable((_b = params === null || params === void 0 ? void 0 : params.addAction) === null || _b === void 0 ? void 0 : _b.name, params === null || params === void 0 ? void 0 : params.addAction));
    }
    return res.join('\n');
}
export const camelToSnakeCase = (str = '  ') => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).split('_').filter(e => e).join('_');
export const UpperFirstLetter = (str = '  ') => str[0].toUpperCase() + str.slice(1);
export function getParamFunction(name = '', nullable = false) {
    if (nullable)
        return `\tthis.${name},\n`;
    return `\t required this.${name},\n`;
}
export function getVariables(props, params) {
    var _a;
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
    if ((_a = params === null || params === void 0 ? void 0 : params.addAction) === null || _a === void 0 ? void 0 : _a.name) {
        res.push(getParamFunction(params.addAction.name, false));
    }
    return `{ \n${res.join('')} }`;
}
export function getCopyWithParams(bloc, params) {
    var _a, _b, _c, _d;
    const res = Object.keys((_a = bloc.state.props) !== null && _a !== void 0 ? _a : {}).map(variable => `\t${variable}: ${variable} ?? this.${variable},\n`);
    if ((_b = params === null || params === void 0 ? void 0 : params.addAction) === null || _b === void 0 ? void 0 : _b.name) {
        res.push(`\t ${(_c = params === null || params === void 0 ? void 0 : params.addAction) === null || _c === void 0 ? void 0 : _c.name}: ${(_d = params === null || params === void 0 ? void 0 : params.addAction) === null || _d === void 0 ? void 0 : _d.name},\n`);
    }
    return res.join('');
}
export function getClearWithParams(bloc, params) {
    var _a, _b, _c, _d;
    const res = Object.keys((_a = bloc.state.props) !== null && _a !== void 0 ? _a : {}).map(name => `\t ${name}: ${name} ? ${getDefaultValue(bloc, name)} : this.${name}, \n`);
    if ((_b = params === null || params === void 0 ? void 0 : params.addAction) === null || _b === void 0 ? void 0 : _b.name) {
        res.push(`\t ${(_c = params === null || params === void 0 ? void 0 : params.addAction) === null || _c === void 0 ? void 0 : _c.name}: ${(_d = params === null || params === void 0 ? void 0 : params.addAction) === null || _d === void 0 ? void 0 : _d.name},\n`);
    }
    return res.join('');
}
