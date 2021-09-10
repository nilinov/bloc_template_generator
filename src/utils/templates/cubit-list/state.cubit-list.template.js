import { camelToSnakeCase, getAllFinalVariables, getCopyWithParams, getGetters, getVariableAndType, getVariables, toMap } from "../../utils.js";
import { getDefaultValue, getVariablesAndDefault } from "../bloc-default/bloc.default.tempalte";
export const EmptyProps = {};
export const EmptyGetter = {};
const stateCubitListTemplate = (bloc) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return `
part of '${camelToSnakeCase(bloc.name)}_cubit.dart';

class ${bloc.name}State {
  ${getAllFinalVariables((_a = bloc.state.props) !== null && _a !== void 0 ? _a : EmptyProps, { addAction: bloc.actionProp })}

  ${bloc.name}State(${getVariables((_b = bloc.state.props) !== null && _b !== void 0 ? _b : EmptyProps, { required: true, addAction: bloc.actionProp })});

  ${bloc.name}State copyWith({
    ${getVariableAndType((_c = bloc.state.props) !== null && _c !== void 0 ? _c : EmptyProps, { noRequired: true, addAction: bloc.actionProp })}}) {
    return ${bloc.name}State(
      ${getCopyWithParams(bloc, { addAction: bloc.actionProp })});
  }

  ${bloc.name}State clearValue({
    ${Object.keys((_d = bloc.state.props) !== null && _d !== void 0 ? _d : EmptyProps).map(name => `\tbool ${name} = false,\n`).join('')}) {
    return ${bloc.name}State(
      ${Object.keys((_e = bloc.state.props) !== null && _e !== void 0 ? _e : EmptyProps).map(name => `\t ${name}: ${name} ? ${getDefaultValue(bloc, name)} : this.${name}, \n`).join('')});
  }

  toMap() => ${toMap((_f = bloc.state.props) !== null && _f !== void 0 ? _f : EmptyProps)};
  
  static empty() => ${bloc.name}State(${getVariablesAndDefault(bloc, { addAction: bloc.actionProp })});

  ${getGetters((_g = bloc.state.getters) !== null && _g !== void 0 ? _g : EmptyGetter)}
}
`;
};
export default stateCubitListTemplate;
