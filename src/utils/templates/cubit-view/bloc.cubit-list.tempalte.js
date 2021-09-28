import { camelToSnakeCase, getVariableAndType, UpperFirstLetter } from "../../utils.js";
import { getVariablesEvent } from "../bloc-default/bloc.default.tempalte";
var blocCubitListTemplate = function (bloc) { return "\npart '" + camelToSnakeCase(bloc.name) + "_state.dart';\n\nconst key" + UpperFirstLetter(bloc.name) + "State = '" + UpperFirstLetter(bloc.name) + "';\n\nclass " + bloc.name + "Cubit extends Cubit<" + bloc.name + "State> {\n  " + bloc.name + "Cubit() : super(" + bloc.name + "State.empty());\n\n  " + bloc.events.map(function (event) { return getEvents(bloc.name, event, bloc); }).filter(function (e) { return e; }).join('\n') + "\n}\n\n"; };
function getEvents(blocName, event, bloc) {
    var _a, _b;
    var name = event.name;
    var nameFunction = '';
    if (event.props) {
        var props = getVariableAndType(event.props, { required: true });
        nameFunction = "Future<void> " + name + "({" + props + "}) async";
    }
    else {
        nameFunction = "Future<void> " + name + "() async ";
    }
    var caseEvent = bloc.bloc.case_event ? (_a = bloc.bloc.case_event[event.name]) !== null && _a !== void 0 ? _a : {} : {};
    return " " + nameFunction + " {\n        emit(state.copyWith(\n" + getVariablesEvent(caseEvent, { addAction: bloc.actionProp, eventName: name }) + "));\n        " + ((_b = caseEvent.content) !== null && _b !== void 0 ? _b : '') + "\n        " + (caseEvent.nextEvent ? caseEvent.nextEvent + "( " + caseEvent.nextEventPayload + " );" : '') + "\n      }\n    ";
}
export { blocCubitListTemplate };
//# sourceMappingURL=bloc.cubit-list.tempalte.js.map