import { camelToSnakeCase, getAllFinalVariables, getCopyWithParams, getGetters, getVariableAndType, getVariables, toMap } from "../../utils.js";
import { getVariablesAndDefault } from "../bloc-default/bloc.default.tempalte";
var stateCubitListTemplate = function (bloc) {
    var _a, _b, _c, _d, _e;
    return "\npart of '" + camelToSnakeCase(bloc.name) + "_cubit.dart';\n\nclass " + bloc.name + "State {\n  " + getAllFinalVariables((_a = bloc.state.props) !== null && _a !== void 0 ? _a : {}, { addAction: bloc.actionProp }) + "\n\n  " + bloc.name + "State(" + getVariables((_b = bloc.state.props) !== null && _b !== void 0 ? _b : {}, { required: true, addAction: bloc.actionProp }) + ");\n\n  " + bloc.name + "State copyWith({\n    " + getVariableAndType((_c = bloc.state.props) !== null && _c !== void 0 ? _c : {}, { noRequired: true, addAction: bloc.actionProp }) + "}) {\n    return new " + bloc.name + "State(\n      " + getCopyWithParams(bloc, { addAction: bloc.actionProp }) + ");\n  }\n\n  toMap() => " + toMap((_d = bloc.state.props) !== null && _d !== void 0 ? _d : {}) + ";\n  \n  static empty() => " + bloc.name + "State(" + getVariablesAndDefault(bloc, { addAction: bloc.actionProp }) + ");\n\n  " + getGetters((_e = bloc.state.getters) !== null && _e !== void 0 ? _e : {}) + "\n}\n";
};
export default stateCubitListTemplate;
//# sourceMappingURL=state.cubit-list.template.js.map