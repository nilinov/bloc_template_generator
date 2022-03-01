import {JsonData} from "./interfaces";
import {getEmptyObjectTs, getVariableAndType, getVariables, getVariablesNames} from "./utils";

export function getInterfaceTS(data: JsonData, params = {}): string {
    return `export interface ${data.name} {
  ${getVariableAndType(data.state.props ?? {}, {lang: 'ts'})}  
}

export function getEmpty${data.name} () {
   return {
      ${getEmptyObjectTs(data.state.props ?? {})}  
   };
}
`.split('integer').join('number')
}

export function getEnumTS(data: JsonData, params = {}): string {
    return `enum ${data.name} {
${getVariablesNames(data.state.props ?? {}, {lang: 'ts', required: true}).map(e => `\t${e} = "${e}",\n`).join('')}  
}`
}
