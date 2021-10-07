/** @type PropItem */
import { getParamFunction } from "@/utils/utils";
export function getPropItemTypeFromSwaggerType(type) {
    switch (type) {
        case "array":
            return "List<>";
        case "boolean":
            return "bool";
        case "integer":
            return "int";
        case "number":
            return "double";
        case "object":
            return "Object";
        case "string":
            return "String";
        default:
            return "Object";
    }
}
var renderCodeLineType = function (item) { return "final " + item.type + (item.nullable ? '?' : '') + " " + item.name + ";"; };
var renderCodeLinePropConstr = function (item) { return getParamFunction(item.name, item.nullable); };
var renderCodeCopyWithParams = function (items) {
    var res = items.map(function (variable) { return "\t" + variable.type + " " + variable.name + ",\n"; });
    return "{ " + res.join('') + " }";
};
var renderCodeCopyWithContent = function (items) {
    var res = items.map(function (variable) { return "\t" + variable.name + ": " + variable.name + " ?? this." + variable.name + ",\n"; });
    return res.join('');
};
export { renderCodeLineType, renderCodeLinePropConstr, renderCodeCopyWithParams, renderCodeCopyWithContent };
//# sourceMappingURL=RenderCodeLineType.js.map