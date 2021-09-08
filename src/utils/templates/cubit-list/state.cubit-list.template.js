import { camelToSnakeCase, getAllFinalVariables, getCopyWithParams, getGetters, getVariableAndType, getVariables, toMap } from "../../utils.js";
import { getVariablesAndDefault } from "../bloc-default/bloc.default.tempalte";
const stateCubitListTemplate = (bloc) => {
    var _a, _b, _c, _d, _e;
    return `
part of '${camelToSnakeCase(bloc.name)}_cubit.dart';

class ${bloc.name}State {
  ${getAllFinalVariables((_a = bloc.state.props) !== null && _a !== void 0 ? _a : {}, { addAction: bloc.actionProp })}

  ${bloc.name}State(${getVariables((_b = bloc.state.props) !== null && _b !== void 0 ? _b : {}, { required: true, addAction: bloc.actionProp })});

  ${bloc.name}State copyWith({
    ${getVariableAndType((_c = bloc.state.props) !== null && _c !== void 0 ? _c : {}, { noRequired: true, addAction: bloc.actionProp })}}) {
    return new ${bloc.name}State(
      ${getCopyWithParams(bloc, { addAction: bloc.actionProp })});
  }

  toMap() => ${toMap((_d = bloc.state.props) !== null && _d !== void 0 ? _d : {})};
  
  static empty() => ${bloc.name}State(${getVariablesAndDefault(bloc, { addAction: bloc.actionProp })});

  ${getGetters((_e = bloc.state.getters) !== null && _e !== void 0 ? _e : {})}
}
`;
};
export default stateCubitListTemplate;
