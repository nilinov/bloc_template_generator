import * as _ from 'lodash';
export function getFullType(prop, params) {
    var _a, _b, _c, _d, _e, _f, _g;
    var afterNoRequired = (params === null || params === void 0 ? void 0 : params.noRequired) ? '?' : '';
    if ((_a = prop.typeTemplate) === null || _a === void 0 ? void 0 : _a.array) {
        return "List<" + prop.typeName + ">" + afterNoRequired;
    }
    else if ((_b = prop.typeTemplate) === null || _b === void 0 ? void 0 : _b.enum) {
        return "" + prop.typeName + afterNoRequired;
    }
    else if ((_c = prop.typeTemplate) === null || _c === void 0 ? void 0 : _c.double) {
        return "double" + afterNoRequired;
    }
    else if ((_d = prop.typeTemplate) === null || _d === void 0 ? void 0 : _d.int) {
        return "int" + afterNoRequired;
    }
    else if ((_e = prop.typeTemplate) === null || _e === void 0 ? void 0 : _e.string) {
        return "String" + afterNoRequired;
    }
    else if ((_f = prop.typeTemplate) === null || _f === void 0 ? void 0 : _f.map) {
        return "Map<" + prop.typeTemplate.map.key + ", " + prop.typeTemplate.map.value + ">";
    }
    else if ((_g = prop.typeTemplate) === null || _g === void 0 ? void 0 : _g.dynamic) {
        return "dynamic";
    }
    return "" + prop.typeName + afterNoRequired;
}
export function toMap(props) {
    return '{\n' + Object.keys(props).map(function (key) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var prop = props[key];
        if ((_a = prop.typeTemplate) === null || _a === void 0 ? void 0 : _a.array) {
            return "\"" + key + "\": '[' + " + key + ".map(e => e.toMap().join(', ') + ']'";
        }
        else if ((_b = prop.typeTemplate) === null || _b === void 0 ? void 0 : _b.enum) {
            return "\"" + key + "\": " + key + ".toString()";
        }
        else if ((_c = prop.typeTemplate) === null || _c === void 0 ? void 0 : _c.double) {
            return "\"" + key + "\": " + key;
        }
        else if ((_d = prop.typeTemplate) === null || _d === void 0 ? void 0 : _d.int) {
            return "\"" + key + "\": " + key;
        }
        else if ((_e = prop.typeTemplate) === null || _e === void 0 ? void 0 : _e.string) {
            return "\"" + key + "\": " + key;
        }
        else if ((_f = prop.typeTemplate) === null || _f === void 0 ? void 0 : _f.bool) {
            return "\"" + key + "\": " + key;
        }
        else if ((_g = prop.typeTemplate) === null || _g === void 0 ? void 0 : _g.map) {
            return "\"" + key + "\": " + key;
        }
        else if (prop.typeName) {
            if (prop.typeName == 'DateTime') {
                return "\"" + key + "\": " + key + ".toIso8601String()";
            }
            else if (prop.typeName == 'bool') {
                return "\"" + key + "\": " + key;
            }
            else if (((_h = prop.typeTemplate) === null || _h === void 0 ? void 0 : _h.array) || prop.typeName.indexOf('List<') != -1) {
                return "\"" + key + "\": " + key;
            }
            else {
                return "\"" + key + "\": " + _.camelCase(prop.typeName) + "ToJson(" + key + ")";
            }
        }
        else {
            console.error("\u041D\u0435 \u043C\u043E\u0433\u0443 \u0432\u044B\u0432\u0435\u0441\u0442\u0438 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u043E " + key, prop);
        }
    }).filter(function (e) { return e; }).join(', \n') + '\n}';
}
function getPropNameFromList(prop) {
    var _a, _b;
    return (_a = prop.typeName) === null || _a === void 0 ? void 0 : _a.substr(5, ((_b = prop.typeName) === null || _b === void 0 ? void 0 : _b.length) - 6);
}
export function fromMap(props) {
    console.log({ props: props });
    return Object.keys(props).map(function (key) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var prop = props[key];
        var nullable = prop.typeTemplate.nullable ? '?' : '';
        if ((_a = prop.typeTemplate) === null || _a === void 0 ? void 0 : _a.array) {
            return key + ": json[\"" + key + "\"].map(e => " + key + ".fromJson(e)) ?? [] as List<" + key + ">";
        }
        else if ((_b = prop.typeTemplate) === null || _b === void 0 ? void 0 : _b.enum) {
            return key + ": " + key + "FromJson(json[\"" + key + "\"])";
        }
        else if ((_c = prop.typeTemplate) === null || _c === void 0 ? void 0 : _c.double) {
            return key + ": " + key + " != null ? (json[\"" + key + "\"] as num).toDouble() : null";
        }
        else if ((_d = prop.typeTemplate) === null || _d === void 0 ? void 0 : _d.int) {
            return key + ": json[\"" + key + "\"] as int" + nullable;
        }
        else if ((_e = prop.typeTemplate) === null || _e === void 0 ? void 0 : _e.string) {
            return key + ": json[\"" + key + "\"] as String" + nullable;
        }
        else if ((_f = prop.typeTemplate) === null || _f === void 0 ? void 0 : _f.map) {
            return key + ": " + key + "FromJson(json[\"" + key + "\"])";
        }
        else if ((_g = prop.typeTemplate) === null || _g === void 0 ? void 0 : _g.class) {
            return key + ": " + prop.typeName + ".fromJson(json[\"" + key + "\"]) as " + prop.typeName;
        }
        else if (prop.typeName) {
            if (prop.typeName == 'DateTime') {
                return key + ": DateTime.parse(json[\"" + key + "\"])";
            }
            else if (prop.typeName == 'bool') {
                return key + ": json[\"" + key + "\"] as bool" + nullable;
            }
            else if (((_h = prop.typeTemplate) === null || _h === void 0 ? void 0 : _h.array) || prop.typeName.indexOf('List<') != -1) {
                return key + ": json[\"" + key + "\"].map((e) => " + getPropNameFromList(prop) + ".fromJson(e)) ?? [] as List<" + getPropNameFromList(prop) + ">";
            }
            else {
                return key + ": " + _.camelCase(prop.typeName) + "FromJson(json[\"" + key + "\"])";
            }
        }
    }).filter(function (e) { return e; }).join(', \n');
}
export function getGetters(getters) {
    return Object.keys(getters).map(function (key) {
        var _a, _b, _c;
        var getter = getters[key];
        if (getter.params)
            return ((_a = getter.returnType) !== null && _a !== void 0 ? _a : '') + " " + key + "(" + ((_b = getter.params) !== null && _b !== void 0 ? _b : '') + ") => " + getter.content + ";";
        return ((_c = getter.returnType) !== null && _c !== void 0 ? _c : '') + " get " + key + " => " + getter.content + ";";
    }).join(' \n');
}
export function getFinalVariable(variable, type, params) {
    var _a;
    var nullable = '';
    if ((_a = type.typeTemplate) === null || _a === void 0 ? void 0 : _a.nullable) {
        nullable = '?';
    }
    return "final " + getFullType(type) + nullable + " " + variable + ";";
}
export function getVariableAndType(variables, params) {
    var _a, _b;
    var res = [];
    if (params === null || params === void 0 ? void 0 : params.required) {
        res = Object.keys(variables).map(function (variable) { return "\t required " + getFullType(variables[variable]) + " " + variable + ",\n"; });
    }
    else if (params === null || params === void 0 ? void 0 : params.noRequired) {
        res = Object.keys(variables).map(function (variable) { return "\t " + getFullType(variables[variable], { noRequired: true }) + " " + variable + ",\n"; });
    }
    else {
        res = Object.keys(variables).map(function (variable) { return "\t" + getFullType(variables[variable]) + " " + variable + ",\n"; });
    }
    if ((_a = params === null || params === void 0 ? void 0 : params.addAction) === null || _a === void 0 ? void 0 : _a.name) {
        res.push("\t required " + getFullType(params === null || params === void 0 ? void 0 : params.addAction) + " " + ((_b = params === null || params === void 0 ? void 0 : params.addAction) === null || _b === void 0 ? void 0 : _b.name) + ",\n");
    }
    return res.join('');
}
export function getAllFinalVariables(variables, params) {
    var _a, _b;
    var res = Object.keys(variables).map(function (variable) { return '\t' + getFinalVariable(variable, variables[variable]); });
    if ((_a = params === null || params === void 0 ? void 0 : params.addAction) === null || _a === void 0 ? void 0 : _a.name) {
        res.push('\t' + getFinalVariable((_b = params === null || params === void 0 ? void 0 : params.addAction) === null || _b === void 0 ? void 0 : _b.name, params === null || params === void 0 ? void 0 : params.addAction));
    }
    return res.join('\n');
}
export var camelToSnakeCase = function (str) {
    if (str === void 0) { str = '  '; }
    return str.replace(/[A-Z]/g, function (letter) { return "_" + letter.toLowerCase(); }).split('_').filter(function (e) { return e; }).join('_');
};
export var UpperFirstLetter = function (str) {
    if (str === void 0) { str = '  '; }
    return str[0].toUpperCase() + str.slice(1);
};
export function getParamFunction(name, nullable) {
    if (name === void 0) { name = ''; }
    if (nullable === void 0) { nullable = false; }
    if (nullable)
        return "\tthis." + name + ",\n";
    return "\t required this." + name + ",\n";
}
export function getVariables(props, params) {
    var _a;
    var res = [];
    if (params === null || params === void 0 ? void 0 : params.required) {
        res = Object.keys(props).map(function (name) { var _a, _b, _c; return getParamFunction(name, (_c = (_b = (_a = props[name]) === null || _a === void 0 ? void 0 : _a.typeTemplate) === null || _b === void 0 ? void 0 : _b.nullable) !== null && _c !== void 0 ? _c : false); });
    }
    else {
        res = Object.keys(props).map(function (name) {
            var _a, _b, _c;
            console.log("" + name);
            return getParamFunction(name, (_c = (_b = (_a = props[name]) === null || _a === void 0 ? void 0 : _a.typeTemplate) === null || _b === void 0 ? void 0 : _b.nullable) !== null && _c !== void 0 ? _c : true);
        });
    }
    if ((_a = params === null || params === void 0 ? void 0 : params.addAction) === null || _a === void 0 ? void 0 : _a.name) {
        res.push(getParamFunction(params.addAction.name, false));
    }
    return "{ \n" + res.join('') + " }";
}
export function getCopyWithParams(bloc, params) {
    var _a, _b, _c, _d;
    var res = Object.keys((_a = bloc.state.props) !== null && _a !== void 0 ? _a : {}).map(function (variable) { return "\t" + variable + ": " + variable + " ?? this." + variable + ",\n"; });
    if ((_b = params === null || params === void 0 ? void 0 : params.addAction) === null || _b === void 0 ? void 0 : _b.name) {
        res.push("\t " + ((_c = params === null || params === void 0 ? void 0 : params.addAction) === null || _c === void 0 ? void 0 : _c.name) + ": " + ((_d = params === null || params === void 0 ? void 0 : params.addAction) === null || _d === void 0 ? void 0 : _d.name) + ",\n");
    }
    return res.join('');
}
//# sourceMappingURL=utils.js.map