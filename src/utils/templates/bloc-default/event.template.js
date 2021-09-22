import { camelToSnakeCase, getAllFinalVariables, getVariables } from "../../utils.js";
import { getFullEventName } from "./bloc.default.tempalte.js";
function getEvents(blocName, event) {
    var name = getFullEventName(blocName, event.name);
    if (event.props) {
        var props = getAllFinalVariables(event.props);
        var constructor = name + "( " + getVariables(event.props, { required: true }) + " );";
        var toString_1 = "@override \n String toString() => \"" + Object.keys(event.props).map(function (name) { return name + "=" + '$' + "{" + name + ".toString()}"; }).join(', ') + "\";\n";
        return "class " + name + " extends " + blocName + "Event {\n        " + props + "\n        " + constructor + "\n        " + toString_1 + "\n       }";
    }
    else {
        return "class " + name + " extends " + blocName + "Event {}";
    }
}
var eventTemplate = function (bloc) { return "\npart of '" + camelToSnakeCase(bloc.name) + "_bloc.dart';\n\n@immutable\nabstract class " + bloc.name + "Event {\n  const " + bloc.name + "Event();\n}\n\n" + bloc.events.map(function (event) { return getEvents(bloc.name, event); }).filter(function (e) { return e; }).join('\n') + "\n"; };
export { eventTemplate };
//# sourceMappingURL=event.template.js.map