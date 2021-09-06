import { camelToSnakeCase, getAllFinalVariables, getGetters, getVariableAndType, getVariables, toMap } from "./utils.js";
const stateDefaultTemplate = (bloc) => `
part of '${camelToSnakeCase(bloc.name)}_bloc.dart';

@immutable
class ${bloc.name}State {
  ${getAllFinalVariables(bloc.state.props)}

  ${bloc.name}State(${getVariables(bloc.state.props, { required: true })});

  @override
  ${bloc.name}State copyWith({
    ${getVariableAndType(bloc.state.props)}}) {
    return new ${bloc.name}State(
      ${Object.keys(bloc.state.props).map(variable => `\t${variable}: ${variable} ?? this.${variable},\n`).join('')});
  }

  @override
  toMap() => ${toMap(bloc.state.props)};

  ${getGetters(bloc.state.getters)}
}
`;
export default stateDefaultTemplate;
