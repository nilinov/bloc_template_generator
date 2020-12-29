import {BlocEvent, JsonData} from "./interfaces.js";
import {camelToSnakeCase, getAllFinalVariables, getVariables} from "./utils.js";
import {getFullEventName} from "./bloc.default.tempalte.js";


function getEvents(blocName: string, event: BlocEvent) {
    const name = getFullEventName(blocName, event.name);
    const props = event.props ? getAllFinalVariables(event.props) : '';
    const constructor = event.props ? `${name}( ${getVariables(event.props, {required: true})} );` : '';

    return `class ${name} extends ${blocName}Event {
        ${props}
        ${constructor}
       }
    `
}

const eventTemplate = (bloc: JsonData) => `
part of '${camelToSnakeCase(bloc.name)}_bloc.dart';

@immutable
abstract class ${bloc.name}Event {
  const ${bloc.name}Event();
}

${bloc.events.map(event => getEvents(bloc.name, event)).filter((e) => e).join('\n')}
`

export {eventTemplate}