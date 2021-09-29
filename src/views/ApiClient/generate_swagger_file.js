export function generateSwaggerFile(allModels, allFunctions) {
    var keysModels = {};
    for (var _i = 0, allModels_1 = allModels; _i < allModels_1.length; _i++) {
        var model = allModels_1[_i];
        keysModels[model.name] = getSchemaDescByClass(model, allModels);
    }
    var path = {};
    var _loop_1 = function (func) {
        var model = allModels.find(function (model) { return model.uuid == func.modelUUID; });
        path[func.path.split('/').map(function (e) { return e[0] === ':' ? "{" + e.replace(':', '') + "}" : e; }).join('/')] = {
            "get": {
                "summary": "function " + func.name,
                "responses": {
                    "200": {
                        "description": "",
                        "schema": getSchemaLinkByClass(model)
                    }
                },
            }
        };
    };
    for (var _a = 0, allFunctions_1 = allFunctions; _a < allFunctions_1.length; _a++) {
        var func = allFunctions_1[_a];
        _loop_1(func);
    }
    return JSON.stringify({
        "swagger": "2.0",
        "info": {
            "version": "1.0.0",
            "title": "Mad Team swagger",
            "description": ""
        },
        "host": "ovz5.j1121565.m719m.vps.myjino.ru",
        "schemes": ["http"],
        "consumes": ["application/json"],
        "produces": ["application/json"],
        "paths": path,
        "definitions": keysModels
    }, null, 2);
}
function getSchemaDescByClass(model, allModels) {
    var _a, _b, _c;
    if (allModels === void 0) { allModels = []; }
    var props = {};
    console.log({ props: props });
    var _loop_2 = function (prop) {
        var _name = getNameClassSingle(prop.name);
        var model_1 = allModels.find(function (e) { return e.name == prop.type; });
        var name_1 = (model_1 === null || model_1 === void 0 ? void 0 : model_1.name) || _name;
        var isArray = (name_1 === null || name_1 === void 0 ? void 0 : name_1.indexOf('List<')) == 0;
        if (!model_1 || !(model_1 === null || model_1 === void 0 ? void 0 : model_1.isEnum)) {
            var type = prop.type.toLowerCase();
            var isModel = false;
            if (model_1) {
                type = { "$ref": "#/definitions/" + getNameClassSingle((_b = model_1 === null || model_1 === void 0 ? void 0 : model_1.name) !== null && _b !== void 0 ? _b : '') };
                isModel = true;
            }
            if (prop.type.indexOf('List<') == 0) {
                type = { "$ref": "#/definitions/" + getNameClassSingle((_c = prop.type) !== null && _c !== void 0 ? _c : '') };
                isModel = true;
            }
            switch (type) {
                case 'int':
                    type = "integer";
                    break;
                case 'datetime':
                    type = "string";
                    break;
                case 'double':
                    type = "number";
                    break;
                case 'bool':
                    type = "boolean";
                    break;
            }
            if (isModel) {
                props[name_1] = type;
            }
            else {
                props[name_1] = {
                    "type": type,
                };
            }
        }
    };
    for (var _i = 0, _d = (_a = model === null || model === void 0 ? void 0 : model.props) !== null && _a !== void 0 ? _a : []; _i < _d.length; _i++) {
        var prop = _d[_i];
        _loop_2(prop);
    }
    return {
        "type": "object",
        "properties": props,
    };
}
function getNameClassSingle(name) {
    if ((name === null || name === void 0 ? void 0 : name.indexOf('List<')) == 0)
        return name === null || name === void 0 ? void 0 : name.substr(5, (name === null || name === void 0 ? void 0 : name.length) - 6);
    return name;
}
function getSchemaLinkByClass(model) {
    var _a, _b;
    if (model === null || model === void 0 ? void 0 : model.isEnum)
        return {
            "type": "string",
            "enum": model.props.map(function (e) { return e.name; }),
        };
    if (((_a = model === null || model === void 0 ? void 0 : model.name) === null || _a === void 0 ? void 0 : _a.indexOf('List<')) == 0) {
        return {
            "type": "array",
            "items": "$ref: '#/definitions/" + getNameClassSingle((_b = model.name) !== null && _b !== void 0 ? _b : '')
        };
    }
    return { "$ref": "#/definitions/" + (model === null || model === void 0 ? void 0 : model.name) };
}
//# sourceMappingURL=generate_swagger_file.js.map