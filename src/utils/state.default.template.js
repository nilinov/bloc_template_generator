import { camelToSnakeCase, getAllFinalVariables, getGetters, getVariableAndType, getVariables, toMap } from "./utils.js";
const stateDefaultTemplate = (bloc) => `
part of '${camelToSnakeCase(bloc.name)}_bloc.dart';

@immutable
class ${bloc.name}State {
  ${getAllFinalVariables(bloc.states[0].props)}

  ${bloc.name}State(${getVariables(bloc.states[0].props, { required: true })});

  @override
  ${bloc.name}State copyWith({
    ${getVariableAndType(bloc.states[0].props)}}) {
    return new ${bloc.name}State(
      ${Object.keys(bloc.states[0].props).map(variable => `\t${variable}: ${variable} ?? this.${variable},\n`).join('')});
  }

  @override
  toMap() => ${toMap(bloc.states[0].props)};

  ${getGetters(bloc.states[0].getters)}
}
`;
export default stateDefaultTemplate;
