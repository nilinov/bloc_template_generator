import { camelToSnakeCase, getAllFinalVariables, getGetters, getVariableAndType, getVariables, toMap } from "../../utils.js";
const stateDefaultTemplate = (bloc) => {
    var _a, _b, _c, _d, _e, _f;
    return `
part of '${camelToSnakeCase(bloc.name)}_bloc.dart';

@immutable
class ${bloc.name}State {
  ${getAllFinalVariables((_a = bloc.state.props) !== null && _a !== void 0 ? _a : {})}

  ${bloc.name}State(${getVariables((_b = bloc.state.props) !== null && _b !== void 0 ? _b : {}, { required: true })});

  @override
  ${bloc.name}State copyWith({
    ${getVariableAndType((_c = bloc.state.props) !== null && _c !== void 0 ? _c : {})}}) {
    return new ${bloc.name}State(
      ${Object.keys((_d = bloc.state.props) !== null && _d !== void 0 ? _d : {}).map(variable => `\t${variable}: ${variable} ?? this.${variable},\n`).join('')});
  }

  @override
  toMap() => ${toMap((_e = bloc.state.props) !== null && _e !== void 0 ? _e : {})};

  ${getGetters((_f = bloc.state.getters) !== null && _f !== void 0 ? _f : {})}
}
`;
};
export default stateDefaultTemplate;
