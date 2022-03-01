import {JsonData} from "./interfaces";
import {getVariableAndType, getVariables, lowercaseFirstLetter} from "./utils";
import {Model, PropItem} from "../views/ModelEditor/RenderCodeLineType";

function getField(propItem: PropItem, render?: string) {
    return `\t{
            label: '${propItem.desc}',
            key: '${propItem.name}',
            type: AppFormFieldType.text,
            typeView: AppFormFieldTypeView.text,
            rules: [ ${propItem.nullable ? "" : "{required: true, message: 'Это поле обязательно для заполнения', trigger: 'blur'}"} ],
        }`
}

export function getTypeScriptForm(data: Model, params = {}): string {
    const className = data.name;
    const exampl = lowercaseFirstLetter(className);
    return `
export const ${exampl}Fields: AppFormField<${className}>[] = [
${data.props.map(e => getField(e)).join(', \n')},
        {...FieldBtnSave, width: '350px', key: 'action'},
  ];`
}
