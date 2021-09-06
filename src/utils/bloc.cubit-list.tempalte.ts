import {Bloc, BlocEvent, CaseEvent, JsonData} from "./interfaces.js";
import {
    camelToSnakeCase,
    getAllFinalVariables,
    getVariableAndType,
    getVariables,
    UpperFirstLetter
} from "./utils.js";
import {
    getEventNext,
    getEventsSwitch,
    getFullEventName,
    getVariablesAndDefault,
    getVariablesEvent
} from "./bloc.default.tempalte";

const blocCubitListTemplate = (bloc: JsonData) => `
const key${UpperFirstLetter(bloc.name)}State = '${UpperFirstLetter(bloc.name)}';

part '${camelToSnakeCase(bloc.name)}_state.dart';

class ${bloc.name}Cubit extends Cubit<${bloc.name}State> {
  ${bloc.name}Cubit() : super(${bloc.name}State.empty());

  ${bloc.events.map(event => getEvents(bloc.name, event, bloc)).filter((e) => e).join('\n')}
}

`

function getEvents(blocName: string, event: BlocEvent, bloc: JsonData) {
    const name = event.name;

    let nameFunction = '';

    if (event.props) {
        const props = getVariableAndType(event.props, {required: true});
        nameFunction = `Future<void> ${name}({${props}}) async`
    } else {
        nameFunction = `Future<void> ${name}() async `;
    }

    const caseEvent = bloc.bloc.case_event ? bloc.bloc.case_event[event.name] ?? {} : {};

    return ` ${nameFunction} {
        emit(state.copyWith(\n${getVariablesEvent(caseEvent, { addAction: bloc.actionProp, eventName: name })}));
        ${caseEvent.content ?? ''}
        ${caseEvent.nextEvent ? `${caseEvent.nextEvent}( ${caseEvent.nextEventPayload} );` : ''}
      }
    `;

}


export {blocCubitListTemplate}