import {JsonData} from "./interfaces";
import {
  fromMap,
  getAllFinalVariables, getClearWithParams,
  getCopyWithParams,
  getGetters,
  getVariableAndType,
  getVariables,
  toMap
} from "./utils";
import {EmptyGetter, EmptyProps} from "./templates/cubit-list/state.cubit-list.template";
import {getDefaultValue, getVariablesAndDefault} from "./templates/bloc-default/bloc.default.tempalte";

export default (bloc: JsonData, params = {postfix: 'State'}) => {
  return `
    ${getAllFinalVariables(bloc.state.props ?? EmptyProps, {addAction: bloc.actionProp})}
  
    ${bloc.name}${params?.postfix}(${getVariables(bloc.state.props ?? EmptyProps, {
    required: true,
    addAction: bloc.actionProp
  })});
  
    ${bloc.name}${params?.postfix} copyWith({
      ${getVariableAndType(bloc.state.props ?? EmptyProps, {noRequired: true, addAction: bloc.actionProp})}}) {
      return ${bloc.name}${params?.postfix}(
        ${getCopyWithParams(bloc, {addAction: bloc.actionProp})});
    }
  
    ${bloc.name}${params?.postfix} clearValue({
      ${Object.keys(bloc.state.props ?? EmptyProps).map(name => `\tbool ${name} = false,\n`).join('')}}) {
      return ${bloc.name}${params?.postfix}(
        ${getClearWithParams(bloc, {addAction: bloc.actionProp})});
    }
  
    toJson() => ${toMap(bloc.state.props ?? EmptyProps)};
    
    static ${bloc.name}${params?.postfix} fromJson(Map<String, dynamic> json) => 
        ${bloc.name}${params?.postfix}(${fromMap(bloc.state.props ?? EmptyProps, {addAction: bloc.actionProp})});
    
    static List<${bloc.name}${params?.postfix}> listFromJson(List? json) => (json ?? []).map((e) => ${bloc.name}${params?.postfix}.fromJson(e)).toList();
    
    static empty() => ${bloc.name}${params?.postfix}(${getVariablesAndDefault(bloc, {addAction: bloc.actionProp})});
  `;
}

const getEnumContent = (bloc: JsonData) => `${Object.keys(bloc.state.props ?? EmptyProps).map(name => `\t${name},`).join('\n')}`

export {
  getEnumContent
};
