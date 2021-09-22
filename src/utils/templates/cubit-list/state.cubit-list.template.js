import { camelToSnakeCase, getGetters } from "../../utils.js";
import getStateDefaultCode from "../../getStateDefaultCode";
export const EmptyProps = {};
export const EmptyGetter = {};
const stateCubitListTemplate = (bloc) => `
part of '${camelToSnakeCase(bloc.name)}_cubit.dart';

class ${bloc.name}State {
  ${getStateDefaultCode(bloc)}

  ${getGetters(bloc.state.getters ?? EmptyGetter)}
}
`;
export default stateCubitListTemplate;
//# sourceMappingURL=state.cubit-list.template.js.map