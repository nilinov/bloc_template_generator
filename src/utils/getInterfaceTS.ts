import {JsonData} from "./interfaces";
import {getVariableAndType, getVariables} from "./utils";

export function getInterfaceTS(data: JsonData, params = {}): string {
    return `interface ${data.name} {
  ${getVariableAndType(data.state.props, {lang: 'ts'})}  
}`
}