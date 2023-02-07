import {JsonData} from "../../interfaces";
import {
  camelToSnakeCase,
  getAllFinalVariables,
  getCopyWithParams,
  getGetters,
  getVariableAndType,
  getVariables,
  toMap
} from "../../utils";
import {getVariablesAndDefault} from "../bloc-default/bloc.default.tempalte";

const stateCubitListTemplate = (bloc: JsonData) => `
part of '${camelToSnakeCase(bloc.name)}_cubit.dart';

class ${bloc.name}State {
  ${getAllFinalVariables(bloc.state.props ?? {}, {addAction: bloc.actionProp})}

  ${bloc.name}State(${getVariables(bloc.state.props ?? {}, {required: true, addAction: bloc.actionProp})});

  ${bloc.name}State copyWith({
    ${getVariableAndType(bloc.state.props ?? {}, {noRequired: true, addAction: bloc.actionProp})}}) {
    return new ${bloc.name}State(
      ${getCopyWithParams(bloc, {addAction: bloc.actionProp})});
  }

  toMap() => ${toMap(bloc.state.props ?? {}, bloc.isSnackcase)};
  
  static empty() => ${bloc.name}State(${getVariablesAndDefault(bloc, {addAction: bloc.actionProp})});

  ${getGetters(bloc.state.getters ?? {})}
}
`;

export default stateCubitListTemplate;
