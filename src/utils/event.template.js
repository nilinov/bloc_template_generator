import { camelToSnakeCase, getAllFinalVariables, getVariables } from "./utils.js";
import { getFullEventName } from "./bloc.default.tempalte.js";
function getEvents(blocName, event) {
    const name = getFullEventName(blocName, event.name);
    if (event.props) {
        const props = getAllFinalVariables(event.props);
        const constructor = `${name}( ${getVariables(event.props, { required: true })} );`;
        const toString = `@override \n String toString() => "${Object.keys(event.props).map((name) => `${name}=${'$'}{${name}.toString()}`).join(', ')}";\n`;
        return `class ${name} extends ${blocName}Event {
        ${props}
        ${constructor}
        ${toString}
       }`;
    }
    else {
        return `class ${name} extends ${blocName}Event {}`;
    }
}
const eventTemplate = (bloc) => `
part of '${camelToSnakeCase(bloc.name)}_bloc.dart';

@immutable
abstract class ${bloc.name}Event {
  const ${bloc.name}Event();
}

${bloc.events.map(event => getEvents(bloc.name, event)).filter((e) => e).join('\n')}
`;
export { eventTemplate };
