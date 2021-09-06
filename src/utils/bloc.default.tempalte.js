import { camelToSnakeCase, UpperFirstLetter } from "./utils.js";
export function getFullEventName(blocName, eventName) {
    return `${blocName}${UpperFirstLetter(eventName)}Event`;
}
function getVariablesAndDefault(bloc) {
    var _a;
    const defaultState = bloc.state;
    return Object.keys((_a = defaultState.props) !== null && _a !== void 0 ? _a : []).map((variable) => { var _a, _b; return `${variable}: ${(_b = (_a = defaultState.props[variable]) === null || _a === void 0 ? void 0 : _a.default) !== null && _b !== void 0 ? _b : 'null'}`; }).join(', \n');
}
function getVariablesEvent(caseEvent) {
    var _a;
    const props = Object.keys((_a = caseEvent.stateUpdate) !== null && _a !== void 0 ? _a : []);
    return props.map(prop => { var _a, _b; return `\t\t\t${prop}: ${(_b = ((_a = caseEvent === null || caseEvent === void 0 ? void 0 : caseEvent.stateUpdate) !== null && _a !== void 0 ? _a : {})[prop]) !== null && _b !== void 0 ? _b : ''},`; }).join(`\n`);
}
const getEventNext = (blocName, caseEvent) => {
    var _a;
    if (caseEvent.nextEvent) {
        return `add(${getFullEventName(blocName, caseEvent.nextEvent)}(${(_a = caseEvent.nextEventPayload) !== null && _a !== void 0 ? _a : ''}));`;
    }
    return '';
};
const getEventsSwitch = (bloc) => {
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
