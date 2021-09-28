import { fromMap, getAllFinalVariables, getClearWithParams, getCopyWithParams, getVariableAndType, getVariables, toMap } from "./utils";
import { EmptyProps } from "./templates/cubit-list/state.cubit-list.template";
import { getVariablesAndDefault } from "./templates/bloc-default/bloc.default.tempalte";
export default (bloc, params = { postfix: 'State' }) => {
    var _a, _b, _c, _d, _e, _f;
    return `
    ${getAllFinalVariables((_a = bloc.state.props) !== null && _a !== void 0 ? _a : EmptyProps, { addAction: bloc.actionProp })}
  
    ${bloc.name}${params === null || params === void 0 ? void 0 : params.postfix}(${getVariables((_b = bloc.state.props) !== null && _b !== void 0 ? _b : EmptyProps, {
        required: true,
        addAction: bloc.actionProp
    })});
  
    ${bloc.name}${params === null || params === void 0 ? void 0 : params.postfix} copyWith({
      ${getVariableAndType((_c = bloc.state.props) !== null && _c !== void 0 ? _c : EmptyProps, { noRequired: true, addAction: bloc.actionProp })}}) {
      return ${bloc.name}${params === null || params === void 0 ? void 0 : params.postfix}(
        ${getCopyWithParams(bloc, { addAction: bloc.actionProp })});
    }
  
    ${bloc.name}${params === null || params === void 0 ? void 0 : params.postfix} clearValue({
      ${Object.keys((_d = bloc.state.props) !== null && _d !== void 0 ? _d : EmptyProps).map(name => `\tbool ${name} = false,\n`).join('')}}) {
      return ${bloc.name}${params === null || params === void 0 ? void 0 : params.postfix}(
        ${getClearWithParams(bloc, { addAction: bloc.actionProp })});
    }
  
    toJson() => ${toMap((_e = bloc.state.props) !== null && _e !== void 0 ? _e : EmptyProps)};
    
    static ${bloc.name}${params === null || params === void 0 ? void 0 : params.postfix} fromJson(Map<String, dynamic> json) => 
        ${bloc.name}${params === null || params === void 0 ? void 0 : params.postfix}(${fromMap((_f = bloc.state.props) !== null && _f !== void 0 ? _f : EmptyProps, { addAction: bloc.actionProp })});
    
    static List<${bloc.name}${params === null || params === void 0 ? void 0 : params.postfix}> listFromJson(List? json) => (json ?? []).map((e) => ${bloc.name}${params === null || params === void 0 ? void 0 : params.postfix}.fromJson(e)).toList();
    
    static empty() => ${bloc.name}${params === null || params === void 0 ? void 0 : params.postfix}(${getVariablesAndDefault(bloc, { addAction: bloc.actionProp })});
  `;
};
const getEnumContent = (bloc) => { var _a; return `${Object.keys((_a = bloc.state.props) !== null && _a !== void 0 ? _a : EmptyProps).map(name => `\t${name},`).join('\n')}`; };
export { getEnumContent };
