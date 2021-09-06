import {JsonData} from "./interfaces.js";
import {
    camelToSnakeCase,
    getAllFinalVariables,
    getFullType,
    getGetters,
    getVariableAndType,
    getVariables,
    toMap
} from "./utils.js";
import {getVariablesAndDefault, getVariablesEvent} from "./bloc.default.tempalte";

const stateCubitListTemplate = (bloc: JsonData) => `
part of '${camelToSnakeCase(bloc.name)}_cubit.dart';

class ${bloc.name}State {
  ${getAllFinalVariables(bloc.state.props ?? {})}

  ${bloc.name}State(${getVariables(bloc.state.props ?? {}, {required: true})});

  ${bloc.name}State copyWith({
    ${getVariableAndType(bloc.state.props ?? {}, {noRequired: true})}}) {
    return new ${bloc.name}State(
      ${Object.keys(bloc.state.props ?? {}).map(variable => `\t${variable}: ${variable} ?? this.${variable},\n`).join('')});
  }

  toMap() => ${toMap(bloc.state.props ?? {})};
  
  static empty() => ${bloc.name}State(${getVariablesAndDefault(bloc)});

  ${getGetters(bloc.state.getters ?? {})}
}
`;

export default stateCubitListTemplate;