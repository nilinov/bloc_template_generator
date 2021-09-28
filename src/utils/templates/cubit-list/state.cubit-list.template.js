import { camelToSnakeCase, getGetters } from "../../utils.js";
import getStateDefaultCode from "../../getStateDefaultCode";
export var EmptyProps = {};
export var EmptyGetter = {};
var stateCubitListTemplate = function (bloc, params) {
    var _a;
    if (params === void 0) { params = {
        ApiCall: 'ApiCall',
        hasSearch: true,
        hasPaginate: true,
        hasFilter: true,
    }; }
    return "\npart of '" + camelToSnakeCase(bloc.name) + "_cubit.dart';\n\nclass " + bloc.name + "State {\n  " + getStateDefaultCode(bloc) + "\n\n  " + getGetters((_a = bloc.state.getters) !== null && _a !== void 0 ? _a : EmptyGetter, params) + "\n}\n";
};
export default stateCubitListTemplate;
//# sourceMappingURL=state.cubit-list.template.js.map