<template>
  <div class="form">
    <div class="inline">
      <TextBox placeholder="Name" v-model="model.requestName"/>
    </div>

    <div class="RenderCode">
      <span class="fileName">{{ fileName }}</span>
      <div class="codeForSave">
      <pre><?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class {{model.requestName}}Request extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            {{code}}
        ];
    }
}
      </pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Model, PropItem} from "./RenderCodeLineType";
import {Component, Vue} from 'vue-property-decorator';
import _ from "lodash";
import {UpperFirstLetter} from "@/utils/utils";
import {simpleTypes} from "@/views/ApiClient/generate_code_api_client";
import TextBox from "@/components/TextBox.vue";
import {getPhpType} from "@/views/ModelEditor/LaravelModel.vue";
import {getClassName} from "@/views/ModelEditor/LaravelSeederFactory.vue";

const VueBase = Vue.extend({
  props: {
    nameClass: {type: String, default: ''},
    model: {
      type: Object,
      default: () => ({}),
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
})

@Component({
  components: {TextBox}
})
export default class LaravelRequest extends VueBase {
  nameClass!: string
  items!: PropItem[]
  model!: Model

  get fileName() {
    return getClassName(this.model.requestName + 'Request') + '.php'
  }

  get className() {
    return (this.model.requestName ?? UpperFirstLetter(_.camelCase(this.nameClass))) + 'Request'
  }

  get allModels(): Model[] {
    return this.$store.state.models;
  }

  get allModelsEnum(): Model[] {
    return this.allModels.filter(e => e.isEnum);
  }

  get simpleItems() {
    return this.items.filter(e => simpleTypes.includes(e.type))
  }

  get enumItems() {
    return this.items.filter(e => this.allModelsEnum.map(e => e.name).includes(e.type))
  }

  get referenceItemsList() {
    return this.items.filter(e => e.type.indexOf('List<') == 0 && !this.allModelsEnum.map(e => e.name).includes(e.type))
  }

  get referenceItems() {
    return this.items.filter(e => e.type.indexOf('List<') != 0 && !simpleTypes.includes(e.type) && !this.allModelsEnum.map(e => e.name).includes(e.type))
  }

  getNameClass(name: string) {
    return UpperFirstLetter(_.camelCase(name.replace('List<', '')))
  }

  get code() {
    return this.simpleItems.map(e => `"${e.name}" => [${e.nullable ? '' : '"required", '}"${getPhpType(e)}", ],\n\t    `).join('')
  }
}
</script>

<style scoped lang="scss">
.form {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr;
  grid-gap: 1rem;
  min-height: auto !important;

  .inline {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 300px 300px 300px;
    grid-gap: 1rem;

  }
}
</style>