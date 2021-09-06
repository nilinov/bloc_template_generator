import { camelToSnakeCase, getVariableAndType, UpperFirstLetter } from "./utils.js";
import { getVariablesEvent } from "./bloc.default.tempalte";
const blocCubitListTemplate = (bloc) => `
const key${UpperFirstLetter(bloc.name)}State = '${UpperFirstLetter(bloc.name)}';

part '${camelToSnakeCase(bloc.name)}_state.dart';

class ${bloc.name}Cubit extends Cubit<${bloc.name}State> {
  ${bloc.name}Cubit() : super(${bloc.name}State.empty());

  ${bloc.events.map(event => getEvents(bloc.name, event, bloc)).filter((e) => e).join('\n')}
}

`;
function getEvents(blocName, event, bloc) {
    var _a, _b;
    const name = event.name;
    let nameFunction = '';
    if (event.props) {
        const props = getVariableAndType(event.props, { required: true });
        nameFunction = `Future<void> ${name}({${props}}) async`;
    }
    else {
        nameFunction = `Future<void> ${name}() async `;
    }
    const caseEvent = bloc.bloc.case_event ? (_a = bloc.bloc.case_event[event.name]) !== null && _a !== void 0 ? _a : {} : {};
    return ` ${nameFunction} {
        emit(state.copyWith(\n${getVariablesEvent(caseEvent)}));
        ${(_b = caseEvent.content) !== null && _b !== void 0 ? _b : ''}
        ${caseEvent.nextEvent ? `${caseEvent.nextEvent}( ${caseEvent.nextEventPayload} );` : ''}
      }
    `;
}
export { blocCubitListTemplate };
