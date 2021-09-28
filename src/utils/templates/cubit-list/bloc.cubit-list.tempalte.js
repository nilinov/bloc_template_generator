import { camelToSnakeCase, getVariableAndType, UpperFirstLetter } from "../../utils.js";
import { getVariablesEvent } from "../bloc-default/bloc.default.tempalte";
const blocCubitListTemplate = (bloc, params = {
    ApiCall: 'ApiCall',
    hasSearch: true,
    hasPaginate: true,
    hasFilter: true,
}) => `
part '${camelToSnakeCase(bloc.name)}_state.dart';

const key${UpperFirstLetter(bloc.name)}State = '${UpperFirstLetter(bloc.name)}';

class ${bloc.name}Cubit extends Cubit<${bloc.name}State> {
  ${bloc.name}Cubit() : super(${bloc.name}State.empty());

  ${bloc.events.filter(e => {
    var _a, _b, _c;
    if (!params.hasSearch)
        if ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('search'))
            return false;
    if (!params.hasPaginate)
        if ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('paginate'))
            return false;
    if (!params.hasFilter)
        if ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('filter'))
            return false;
    return true;
}).map(event => getEvents(bloc.name, event, bloc)).filter((e) => e).join('\n')}
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
        emit(state.copyWith(\n${getVariablesEvent(caseEvent, { addAction: bloc.actionProp, eventName: name })}));
        ${(_b = caseEvent.content) !== null && _b !== void 0 ? _b : ''}
        ${caseEvent.nextEvent ? `${caseEvent.nextEvent}( ${caseEvent.nextEventPayload} );` : ''}
      }
    `;
}
export { blocCubitListTemplate };
