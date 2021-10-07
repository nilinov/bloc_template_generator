import { __awaiter, __generator } from "tslib";
import SwaggerParser from "@apidevtools/swagger-parser";
import yaml from "js-yaml";
import { getPropItemTypeFromSwaggerType } from "@/views/ModelEditor/RenderCodeLineType";
function getPropItemFromSwaggerTypeRef(prop) {
    if (prop['$ref']) {
        var _items = prop['$ref'].split('/');
        return {
            name: _items[_items.length - 1],
            desc: '',
            type: _items[_items.length - 1],
            nullable: false,
            defaultValue: "",
        };
    }
    else {
        return {
            type: getPropItemTypeFromSwaggerType(prop['type']),
            name: getPropItemTypeFromSwaggerType(prop['type']),
            defaultValue: "",
            desc: "",
            nullable: false,
        };
    }
}
export function parseSwagger(text) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var resYaml, res, yamlModels, yamlModels2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    resYaml = yaml.load(text);
                    return [4 /*yield*/, SwaggerParser.parse(resYaml)];
                case 1:
                    res = _b.sent();
                    console.log({ res: res });
                    yamlModels = Object.values((_a = (res.components).schemas) !== null && _a !== void 0 ? _a : {});
                    yamlModels2 = yamlModels.map(function (e) {
                        var _a, _b, _c;
                        var props = [];
                        var _props = Object.keys((_a = e.properties) !== null && _a !== void 0 ? _a : {}).map(function (key) {
                            // @ts-ignore
                            var prop = e.properties[key];
                            if (prop['type'] == "array") {
                                props.push(getPropItemFromSwaggerTypeRef(prop['items']));
                            }
                            else if (prop['$ref']) {
                                props.push(getPropItemFromSwaggerTypeRef(prop));
                            }
                        });
                        // ( ?? []).map(e2 => ({
                        //     name: e2.title ?? '',
                        //     desc: e2.description ?? '',
                        //     type: getPropItemTypeFromSwaggerType(e2.type ?? ''),
                        //     defaultValue: e2.default,
                        //     nullable: e2.nullable ?? false,
                        // }))
                        return {
                            name: (_b = e.title) !== null && _b !== void 0 ? _b : '',
                            isEnum: !!e.enum,
                            uuid: Math.random().toString(),
                            desc: (_c = e.description) !== null && _c !== void 0 ? _c : '',
                            props: props
                        };
                    });
                    return [2 /*return*/, {
                            models: yamlModels2,
                        }];
            }
        });
    });
}
//# sourceMappingURL=parse_swagger.js.map