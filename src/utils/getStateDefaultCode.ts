import {JsonData} from "./interfaces";
import {
  fromMap,
  getAllFinalVariables,
  getCopyWithParams,
  getGetters,
  getVariableAndType,
  getVariables,
  toMap
} from "./utils";
import {EmptyGetter, EmptyProps} from "./templates/cubit-list/state.cubit-list.template";
import {getDefaultValue, getVariablesAndDefault} from "./templates/bloc-default/bloc.default.tempalte";

export default (bloc: JsonData) => `
  ${getAllFinalVariables(bloc.state.props ?? EmptyProps, {addAction: bloc.actionProp})}

  ${bloc.name}State(${getVariables(bloc.state.props ?? EmptyProps, {required: true, addAction: bloc.actionProp})});

  ${bloc.name}State copyWith({
    ${getVariableAndType(bloc.state.props ?? EmptyProps, {noRequired: true, addAction: bloc.actionProp})}}) {
    return ${bloc.name}State(
      ${getCopyWithParams(bloc, {addAction: bloc.actionProp})});
  }

  ${bloc.name}State clearValue({
    ${Object.keys(bloc.state.props ?? EmptyProps).map(name => `\tbool ${name} = false,\n`).join('')}) {
    return ${bloc.name}State(
      ${Object.keys(bloc.state.props ?? EmptyProps).map(name => `\t ${name}: ${name} ? ${getDefaultValue(bloc, name)} : this.${name}, \n`).join('')});
  }

  toJson() => ${toMap(bloc.state.props ?? EmptyProps)};
  
  fromJson(Map<String, dynamic> json) => ${bloc.name}(${fromMap(bloc.state.props ?? EmptyProps)});
  
  static empty() => ${bloc.name}State(${getVariablesAndDefault(bloc, {addAction: bloc.actionProp})});
`

const getEnumContent = (bloc: JsonData) => `${Object.keys(bloc.state.props ?? EmptyProps).map(name => `\t${name},`).join('\n')}`

export {
  getEnumContent
};