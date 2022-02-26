import {JsonData} from "./interfaces";
import {getVariableAndType, getVariables} from "./utils";
import {Model} from "../views/ModelEditor/RenderCodeLineType";

function getColumn(title: string, type: string, code: string, render?: string, className?: string) {
    return `\t{
            title: '${title}',
            type: '${type}',
            code: '${code}', ${render ? `\n\trender: (text: string, row: ${className}) => {\n\t  ${render} \n\t},` : ''}
        }`
}

export function getElementUiTable(data: Model, params = {}): string {
    const className = data.name;
    return `
export default table: AppTable<${className}> = {
    title: '${data.desc}',
    columns: [
${data.props.map((prop) => {
        if (['String',].includes(prop.type)) {
            return getColumn(prop.name, 'plain', prop.desc)
        }

        if (['number', 'int', 'double'].includes(prop.type)) {
            return getColumn(prop.name, 'plain', prop.desc)
        }
        
        if (prop.type == 'DateTime') {
            return getColumn(prop.name, 'plain', prop.desc, "return `${dateFormatter(row.updatedAt ?? row.createdAt ?? '')}`", data.name)
        }

        return `\t`;
    }).join(', \n')}
    ]
};`
}
