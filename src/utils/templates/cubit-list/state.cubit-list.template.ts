import {BlocGetter, JsonData, Prop} from "../../interfaces";
import {camelToSnakeCase, getGetters} from "../../utils";
import getStateDefaultCode from "../../getStateDefaultCode";

export const EmptyProps: { [name: string]: Prop } = {};
export const EmptyGetter: { [name: string]: BlocGetter } = {};

const stateCubitListTemplate = (bloc: JsonData, params = {
    ApiCall: 'ApiCall',
    hasSearch: true,
    hasPaginate: true,
    hasFilter: true,
}) => `
import '../../_imports.dart';

class ${bloc.name}State {
  ${getStateDefaultCode(bloc)}

  ${getGetters(bloc.state.getters ?? EmptyGetter, params)}
}
`;

export default stateCubitListTemplate;
