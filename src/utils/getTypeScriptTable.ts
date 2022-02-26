import {JsonData} from "./interfaces";
import {getVariableAndType, getVariables, lowercaseFirstLetter} from "./utils";
import {Model} from "../views/ModelEditor/RenderCodeLineType";

function getColumn(title: string, type: string, code: string, render?: string, className?: string) {
    return `\t{
            title: '${title}',
            type: '${type}',
            code: '${code}', ${render ? `\n\trender: (text: string, row: ${className}) => {\n\t  ${render} \n\t},` : ''}
        }`
}

export function getTypeScriptTable(data: Model, params = {}): string {
    const className = data.name;
    const exampl = lowercaseFirstLetter(className);
    return `
export const ${exampl}Table: AppTable<${className}> = {
    title: '${data.desc}',
    columns: [
${data.props.map((prop) => {
        if (['String',].includes(prop.type)) {
            return getColumn(prop.desc, 'plain', prop.name)
        }

        if (['number', 'int', 'double'].includes(prop.type)) {
            return getColumn(prop.desc, 'plain', prop.name)
        }
        
        if (prop.type == 'DateTime') {
            return getColumn(prop.desc, 'plain', prop.name, "return `${dateFormatter(row.updatedAt ?? row.createdAt ?? '')}`", data.name)
        }

        return `\t`;
    }).join(', \n')}
    ]
};`
}
