import { camelToSnakeCase, UpperFirstLetter } from "./utils.js";
export function getFullEventName(blocName, eventName) {
    return `${blocName}${UpperFirstLetter(eventName)}Event`;
}
function getVariablesAndDefault(bloc) {
    const defaultState = bloc.states[0];
    return Object.keys(defaultState.props).map((variable) => `${variable}: ${defaultState.props[variable].default ?? 'null'}`).join(', \n');
}
function getVariablesEvent(caseEvent) {
    const props = Object.keys(caseEvent.stateUpdate);
    return props.map(prop => `\t\t\t${prop}: ${caseEvent.stateUpdate[prop]},`).join(`\n`);
}
const getEventNext = (blocName, caseEvent) => {
    if (caseEvent.nextEvent) {
        return `add(${getFullEventName(blocName, caseEvent.nextEvent)}(${caseEvent.nextEventPayload ?? ''}));`;
    }
    return '';
};
const getEventsSwitch = (bloc) => {
    const events = bloc.events;
    return events.map((event) => {
        const eventName = event.name;
        const caseEvent = bloc.bloc.case_event[eventName];
        return `
            if (event is ${getFullEventName(bloc.name, eventName)}) {
                yield state.copyWith(
${getVariablesEvent(caseEvent)}
                );
              ${caseEvent.content ?? ''}
              ${getEventNext(bloc.name, caseEvent)}
            }
    `;
    }).join('\n');
};
const blocDefaultTemplate = (bloc) => `
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
    add(${getFullEventName(bloc.name, bloc.events.find(event => event.isDefaultError).name)}(error: error.toString()));
    super.onError(error, stackTrace);
  }
` : ''}
}


`;
export { blocDefaultTemplate };
//# sourceMappingURL=bloc.default.tempalte.js.map