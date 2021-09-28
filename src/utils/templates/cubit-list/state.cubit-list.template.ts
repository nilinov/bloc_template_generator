import {BlocGetter, JsonData, Prop} from "../../interfaces.js";
import {
  camelToSnakeCase,
  getAllFinalVariables,
  getCopyWithParams,
  getGetters,
  getVariableAndType,
  getVariables,
  toMap
} from "../../utils.js";
import {getDefaultValue, getVariablesAndDefault} from "../bloc-default/bloc.default.tempalte";
import getStateDefaultCode from "../../getStateDefaultCode";

export const EmptyProps: {[name: string]: Prop} = {};
export const EmptyGetter: {[name: string]: BlocGetter} = {};

const stateCubitListTemplate = (bloc: JsonData, params = {
  ApiCall: 'ApiCall',
  hasSearch: true,
  hasPaginate: true,
  hasFilter: true,
}) => `
part of '${camelToSnakeCase(bloc.name)}_cubit.dart';

class ${bloc.name}State {
  ${getStateDefaultCode(bloc)}

  ${getGetters(bloc.state.getters ?? EmptyGetter, params)}
}
`;

export default stateCubitListTemplate;
