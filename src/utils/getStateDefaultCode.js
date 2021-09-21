import { fromMap, getAllFinalVariables, getCopyWithParams, getVariableAndType, getVariables, toMap } from "./utils";
import { EmptyProps } from "./templates/cubit-list/state.cubit-list.template";
import { getDefaultValue, getVariablesAndDefault } from "./templates/bloc-default/bloc.default.tempalte";
export default (bloc, params = { postfix: 'State' }) => `
  ${getAllFinalVariables(bloc.state.props ?? EmptyProps, { addAction: bloc.actionProp })}

  ${bloc.name}${params?.postfix}(${getVariables(bloc.state.props ?? EmptyProps, { required: true, addAction: bloc.actionProp })});

  ${bloc.name}${params?.postfix} copyWith({
    ${getVariableAndType(bloc.state.props ?? EmptyProps, { noRequired: true, addAction: bloc.actionProp })}}) {
    return ${bloc.name}${params?.postfix}(
      ${getCopyWithParams(bloc, { addAction: bloc.actionProp })});
  }

  ${bloc.name}${params?.postfix} clearValue({
    ${Object.keys(bloc.state.props ?? EmptyProps).map(name => `\tbool ${name} = false,\n`).join('')}}) {
    return ${bloc.name}${params?.postfix}(
      ${Object.keys(bloc.state.props ?? EmptyProps).map(name => `\t ${name}: ${name} ? ${getDefaultValue(bloc, name)} : this.${name}, \n`).join('')});
  }

  toJson() => ${toMap(bloc.state.props ?? EmptyProps)};
  
  static fromJson(Map<String, dynamic> json) => ${bloc.name}(${fromMap(bloc.state.props ?? EmptyProps)});
  
  static empty() => ${bloc.name}${params?.postfix}(${getVariablesAndDefault(bloc, { addAction: bloc.actionProp })});
`;
const getEnumContent = (bloc) => `${Object.keys(bloc.state.props ?? EmptyProps).map(name => `\t${name},`).join('\n')}`;
export { getEnumContent };
//# sourceMappingURL=getStateDefaultCode.js.map