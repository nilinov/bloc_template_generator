import {JsonData} from "./interfaces";
import {getVariableAndType, getVariables, getVariablesNames} from "./utils";

export function getInterfaceTS(data: JsonData, params = {}): string {
    return `interface ${data.name} {
  ${getVariableAndType(data.state.props ?? {}, {lang: 'ts'})}  
}`.split('integer').join('number')
}

export function getEnumTS(data: JsonData, params = {}): string {
    return `enum ${data.name} {
${getVariablesNames(data.state.props ?? {}, {lang: 'ts', required: true}).map(e => `\t${e} = "${e}",\n`).join('')}  
}`
}
