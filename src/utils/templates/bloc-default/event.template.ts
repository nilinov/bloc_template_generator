import {BlocEvent, JsonData} from "../../interfaces";
import {getFullEventName} from "./bloc.default.tempalte";
import {camelToSnakeCase, getAllFinalVariables, getVariables} from "../../utils";


function getEvents(blocName: string, event: BlocEvent) {
    const name = getFullEventName(blocName, event.name);

    if (event.props) {
        const props = getAllFinalVariables(event.props);
        const constructor = `${name}( ${getVariables(event.props, {required: true})} );`;
        const toString = `@override \n String toString() => "${Object.keys(event.props).map((name) => `${name}=${'$'}{${name}.toString()}`).join(', ')}";\n`;

        return `class ${name} extends ${blocName}Event {
        ${props}
        ${constructor}
        ${toString}
       }`
    } else {
        return `class ${name} extends ${blocName}Event {}`;
    }
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