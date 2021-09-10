import { camelToSnakeCase, UpperFirstLetter } from "../../utils.js";
export function getFullEventName(blocName, eventName) {
    return `${blocName}${UpperFirstLetter(eventName)}Event`;
}
export function getDefaultValue(bloc, name) {
    var _a, _b, _c, _d, _e, _f, _g;
    // @ts-ignore
    const prop = bloc.state.props[name];
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
    var _a, _b;
    const defaultState = bloc.state;
    const res = Object.keys((_a = defaultState.props) !== null && _a !== void 0 ? _a : []).map((variable) => {
        var _a, _b, _c;
        const props = defaultState.props;
        let defaultValue = 'null';
        if (props && ((_a = props[variable]) === null || _a === void 0 ? void 0 : _a.default)) {
            defaultValue = (_c = (_b = props[variable]) === null || _b === void 0 ? void 0 : _b.default) !== null && _c !== void 0 ? _c : 'null';
        }
        return `${variable}: ${defaultValue}`;
    });
    if (params === null || params === void 0 ? void 0 : params.addAction) {
        res.push(`${params.addAction.name}: ${(_b = params.addAction.default) !== null && _b !== void 0 ? _b : 'null'}`);
    }
    return res.join(', \n');
}
export function getVariablesEvent(caseEvent, params) {
    var _a, _b, _c;
    const props = Object.keys((_a = caseEvent.stateUpdate) !== null && _a !== void 0 ? _a : []);
    const res = props.map(prop => { var _a, _b; return `\t\t\t${prop}: ${(_b = ((_a = caseEvent === null || caseEvent === void 0 ? void 0 : caseEvent.stateUpdate) !== null && _a !== void 0 ? _a : {})[prop]) !== null && _b !== void 0 ? _b : ''},`; });
    if (params === null || params === void 0 ? void 0 : params.addAction) {
        res.push(`\t\t\t${(_b = params.addAction.name) !== null && _b !== void 0 ? _b : ''}: "${(_c = params === null || params === void 0 ? void 0 : params.eventName) !== null && _c !== void 0 ? _c : ''}",`);
    }
    return res.join(`\n`);
}
export const getEventNext = (blocName, caseEvent) => {
    var _a;
    if (caseEvent.nextEvent) {
        return `add(${getFullEventName(blocName, caseEvent.nextEvent)}(${(_a = caseEvent.nextEventPayload) !== null && _a !== void 0 ? _a : ''}));`;
    }
    return '';
};
export const getEventsSwitch = (bloc) => {
    const events = bloc.events;
    return events.map((event) => {
        var _a, _b;
        const eventName = event.name;
        const caseEvent = bloc.bloc.case_event ? (_a = bloc.bloc.case_event[eventName]) !== null && _a !== void 0 ? _a : {} : {};
        return `
            if (event is ${getFullEventName(bloc.name, eventName)}) {
                yield state.copyWith(
${getVariablesEvent(caseEvent)}
                );
              ${(_b = caseEvent.content) !== null && _b !== void 0 ? _b : ''}
              ${getEventNext(bloc.name, caseEvent)}
            }
    `;
    }).join('\n');
};
const blocDefaultTemplate = (bloc) => {
    var _a, _b;
    return `
import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';

part '${camelToSnakeCase(bloc.name)}_state.dart';
part '${camelToSnakeCase(bloc.name)}_event.dart';

class ${bloc.name}Bloc extends Bloc<${bloc.name}Event, ${bloc.name}State> {
  ${bloc.name}Bloc()
      : super(${bloc.name}State(${getVariablesAndDefault(bloc)}));

  @override
  Stream<${bloc.name}State> mapEventToState(
    ${bloc.name}Event event,
  ) async* {
  
  ${getEventsSwitch(bloc)}
  
  }
  
    ${bloc.bloc.onError ? `@override
  void onError(Object error, StackTrace stackTrace) {
    add(${getFullEventName(bloc.name, (_b = (_a = bloc.events.find(event => event.isDefaultError)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '')}(error: error.toString()));
    super.onError(error, stackTrace);
  }
` : ''}
}


`;
};
export { blocDefaultTemplate };
