import { camelToSnakeCase, getGetters } from "../../utils.js";
import getStateDefaultCode from "../../getStateDefaultCode";
export const EmptyProps = {};
export const EmptyGetter = {};
const stateCubitListTemplate = (bloc) => {
    var _a;
    return `
part of '${camelToSnakeCase(bloc.name)}_cubit.dart';

class ${bloc.name}State {
  ${getStateDefaultCode(bloc)}

  ${getGetters((_a = bloc.state.getters) !== null && _a !== void 0 ? _a : EmptyGetter)}
}
`;
};
export default stateCubitListTemplate;
