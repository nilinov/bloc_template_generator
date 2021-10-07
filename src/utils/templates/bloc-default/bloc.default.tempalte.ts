import {CaseEvent, JsonData, Prop} from "../../interfaces";
import {camelToSnakeCase, UpperFirstLetter} from "../../utils";

export function getFullEventName(blocName: string, eventName: string) {
    return `${blocName}${UpperFirstLetter(eventName)}Event`;
}

export function getDefaultValue(bloc: JsonData, name: string) {
    // @ts-ignore
    const prop = bloc.state.props[name];

    if (prop) {
        if (prop.default) return prop.default;
        if (prop.typeTemplate?.nullable) {
            return 'null';
        }

        if (prop.typeTemplate?.map) return '{}';
        if (prop.typeTemplate?.int) return '0';
        if (prop.typeTemplate?.string) return '""';
        if (prop.typeTemplate?.array) return '[]';
        if (prop.typeTemplate?.double) return '0.0';
        if (prop.typeTemplate?.dynamic) return 'null';
    }

    return 'null'
}

export function getVariablesAndDefault(bloc: JsonData, params?: { addAction?: Prop }) {
    const defaultState = bloc.state
    const res = Object.keys(defaultState.props ?? []).map((variable) => {
        const props = defaultState.props;
        let defaultValue = 'null';
        if (props && props[variable]?.default) {
            defaultValue = props[variable]?.default ?? 'null';
        }
        return `${variable}: ${defaultValue}`;
    })

    if (params?.addAction?.name) {
        res.push(`${params.addAction.name}: ${params.addAction.default ?? 'null'}`)
    }

    return res.join(', \n');
}

export function getVariablesEvent(caseEvent: CaseEvent, params?: { addAction?: Prop, eventName?: string }) {
    const props = Object.keys(caseEvent.stateUpdate ?? [])
    const res = props.map(prop => `\t\t\t${prop}: ${(caseEvent?.stateUpdate ?? {})[prop] ?? ''},`);

    if (params?.addAction) {
        res.push(`\t\t\t${params.addAction.name ?? ''}: "${params?.eventName ?? ''}",`)
    }

    return res.join(`\n`);
}

export const getEventNext = (blocName: string, caseEvent: CaseEvent) => {
    if (caseEvent.nextEvent) {
        return `add(${getFullEventName(blocName, caseEvent.nextEvent)}(${caseEvent.nextEventPayload ?? ''}));`
    }
    return '';
}

export const getEventsSwitch = (bloc: JsonData) => {
    const events = bloc.events;
    return events.map((event) => {
        const eventName = event.name;
        const caseEvent = bloc.bloc.case_event ? bloc.bloc.case_event[eventName] ?? {} : {};

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
}

const blocDefaultTemplate = (bloc: JsonData) => `
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
    add(${getFullEventName(bloc.name, bloc.events.find(event => event.isDefaultError)?.name ?? '')}(error: error.toString()));
    super.onError(error, stackTrace);
  }
` : ''}
}


`

export {blocDefaultTemplate}