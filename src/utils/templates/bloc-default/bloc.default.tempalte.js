import { camelToSnakeCase, UpperFirstLetter } from "../../utils.js";
export function getFullEventName(blocName, eventName) {
    return "" + blocName + UpperFirstLetter(eventName) + "Event";
}
export function getDefaultValue(bloc, name) {
    var _a, _b, _c, _d, _e, _f, _g;
    // @ts-ignore
    var prop = bloc.state.props[name];
    if (prop) {
        if (prop.default)
            return prop.default;
        if ((_a = prop.typeTemplate) === null || _a === void 0 ? void 0 : _a.nullable) {
            return 'null';
        }
        if ((_b = prop.typeTemplate) === null || _b === void 0 ? void 0 : _b.map)
            return '{}';
        if ((_c = prop.typeTemplate) === null || _c === void 0 ? void 0 : _c.int)
            return '0';
        if ((_d = prop.typeTemplate) === null || _d === void 0 ? void 0 : _d.string)
            return '""';
        if ((_e = prop.typeTemplate) === null || _e === void 0 ? void 0 : _e.array)
            return '[]';
        if ((_f = prop.typeTemplate) === null || _f === void 0 ? void 0 : _f.double)
            return '0.0';
        if ((_g = prop.typeTemplate) === null || _g === void 0 ? void 0 : _g.dynamic)
            return 'null';
    }
    return 'null';
}
export function getVariablesAndDefault(bloc, params) {
    var _a, _b, _c;
    var defaultState = bloc.state;
    var res = Object.keys((_a = defaultState.props) !== null && _a !== void 0 ? _a : []).map(function (variable) {
        var _a, _b, _c;
        var props = defaultState.props;
        var defaultValue = 'null';
        if (props && ((_a = props[variable]) === null || _a === void 0 ? void 0 : _a.default)) {
            defaultValue = (_c = (_b = props[variable]) === null || _b === void 0 ? void 0 : _b.default) !== null && _c !== void 0 ? _c : 'null';
        }
        return variable + ": " + defaultValue;
    });
    if ((_b = params === null || params === void 0 ? void 0 : params.addAction) === null || _b === void 0 ? void 0 : _b.name) {
        res.push(params.addAction.name + ": " + ((_c = params.addAction.default) !== null && _c !== void 0 ? _c : 'null'));
    }
    return res.join(', \n');
}
export function getVariablesEvent(caseEvent, params) {
    var _a, _b, _c;
    var props = Object.keys((_a = caseEvent.stateUpdate) !== null && _a !== void 0 ? _a : []);
    var res = props.map(function (prop) { var _a, _b; return "\t\t\t" + prop + ": " + ((_b = ((_a = caseEvent === null || caseEvent === void 0 ? void 0 : caseEvent.stateUpdate) !== null && _a !== void 0 ? _a : {})[prop]) !== null && _b !== void 0 ? _b : '') + ","; });
    if (params === null || params === void 0 ? void 0 : params.addAction) {
        res.push("\t\t\t" + ((_b = params.addAction.name) !== null && _b !== void 0 ? _b : '') + ": \"" + ((_c = params === null || params === void 0 ? void 0 : params.eventName) !== null && _c !== void 0 ? _c : '') + "\",");
    }
    return res.join("\n");
}
export var getEventNext = function (blocName, caseEvent) {
    var _a;
    if (caseEvent.nextEvent) {
        return "add(" + getFullEventName(blocName, caseEvent.nextEvent) + "(" + ((_a = caseEvent.nextEventPayload) !== null && _a !== void 0 ? _a : '') + "));";
    }
    return '';
};
export var getEventsSwitch = function (bloc) {
    var events = bloc.events;
    return events.map(function (event) {
        var _a, _b;
        var eventName = event.name;
        var caseEvent = bloc.bloc.case_event ? (_a = bloc.bloc.case_event[eventName]) !== null && _a !== void 0 ? _a : {} : {};
        return "\n            if (event is " + getFullEventName(bloc.name, eventName) + ") {\n                yield state.copyWith(\n" + getVariablesEvent(caseEvent) + "\n                );\n              " + ((_b = caseEvent.content) !== null && _b !== void 0 ? _b : '') + "\n              " + getEventNext(bloc.name, caseEvent) + "\n            }\n    ";
    }).join('\n');
};
var blocDefaultTemplate = function (bloc) {
    var _a, _b;
    return "\nimport 'dart:async';\n\nimport 'package:bloc/bloc.dart';\nimport 'package:meta/meta.dart';\n\npart '" + camelToSnakeCase(bloc.name) + "_state.dart';\npart '" + camelToSnakeCase(bloc.name) + "_event.dart';\n\nclass " + bloc.name + "Bloc extends Bloc<" + bloc.name + "Event, " + bloc.name + "State> {\n  " + bloc.name + "Bloc()\n      : super(" + bloc.name + "State(" + getVariablesAndDefault(bloc) + "));\n\n  @override\n  Stream<" + bloc.name + "State> mapEventToState(\n    " + bloc.name + "Event event,\n  ) async* {\n  \n  " + getEventsSwitch(bloc) + "\n  \n  }\n  \n    " + (bloc.bloc.onError ? "@override\n  void onError(Object error, StackTrace stackTrace) {\n    add(" + getFullEventName(bloc.name, (_b = (_a = bloc.events.find(function (event) { return event.isDefaultError; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '') + "(error: error.toString()));\n    super.onError(error, stackTrace);\n  }\n" : '') + "\n}\n\n\n";
};
export { blocDefaultTemplate };
//# sourceMappingURL=bloc.default.tempalte.js.map