/** @type PropItem */
import {getParamFunction} from "@/utils/utils";

export interface Model {
    uuid: string,
    name: string,
    desc: string,
    props: PropItem[],
    isEnum: boolean,
}

export interface PropItem {
    name: string,
    desc: string,
    type: 'String' | 'int' | 'double' | 'DateTime' | string,
    defaultValue: '' | '0' | 'false' | 'true' | string,
    nullable: boolean,
}

const renderCodeLineType = (item: PropItem) => `final ${item.type}${item.nullable ? '?' : ''} ${item.name};`;
const renderCodeLinePropConstr = (item: PropItem) => getParamFunction(item.name, item.nullable);

const renderCodeCopyWithParams = (items: PropItem[]) => {
    const res = items.map(variable => `\t${variable.type} ${variable.name},\n`);

    return `{ ${res.join('')} }`;
}

const renderCodeCopyWithContent = (items: PropItem[]) => {
    const res = items.map(variable => `\t${variable.name}: ${variable.name} ?? this.${variable.name},\n`);

    return res.join('');
}

export {renderCodeLineType, renderCodeLinePropConstr, renderCodeCopyWithParams, renderCodeCopyWithContent};

export interface User {
    displayName: string,
    email: string,
}
