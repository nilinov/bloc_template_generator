/** @type PropItem */
import { getParamFunction } from "@/utils/utils";
const renderCodeLineType = (item) => `final ${item.type}${item.nullable ? '?' : ''} ${item.name};`;
const renderCodeLinePropConstr = (item) => getParamFunction(item.name, item.nullable);
const renderCodeCopyWithParams = (items) => {
    const res = items.map(variable => `\t${variable.type} ${variable.name},\n`);
    return `{ ${res.join('')} }`;
};
const renderCodeCopyWithContent = (items) => {
    const res = items.map(variable => `\t${variable.name}: ${variable.name} ?? this.${variable.name},\n`);
    return res.join('');
};
export { renderCodeLineType, renderCodeLinePropConstr, renderCodeCopyWithParams, renderCodeCopyWithContent };
//# sourceMappingURL=RenderCodeLineType.js.map