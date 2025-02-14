import {BlocGetter, JsonData, Prop} from "../../interfaces.js";
import {
  camelToSnakeCase,
  getAllFinalVariables,
  getCopyWithParams,
  getGetters,
  getVariableAndType,
  getVariables,
  toMap
} from "../../utils.js";
import {getDefaultValue, getVariablesAndDefault} from "../bloc-default/bloc.default.tempalte";

export const EmptyProps: {[name: string]: Prop} = {};
export const EmptyGetter: {[name: string]: BlocGetter} = {};

const stateCubitListTemplate = (bloc: JsonData) => `
part of '${camelToSnakeCase(bloc.name)}_cubit.dart';

class ${bloc.name}State {
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

  toMap() => ${toMap(bloc.state.props ?? EmptyProps)};
  
  static empty() => ${bloc.name}State(${getVariablesAndDefault(bloc, {addAction: bloc.actionProp})});

  ${getGetters(bloc.state.getters ?? EmptyGetter)}
}
`;

export default stateCubitListTemplate;
