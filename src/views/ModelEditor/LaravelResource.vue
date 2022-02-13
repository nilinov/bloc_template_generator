<template>
  <div class="form">
    <div class="inline" v-for="item of model.props">
      <TextBox placeholder="Name" :value="item.name" disabled/>
      Использовать в ресурсе
      <input type="checkbox" v-model="item.inResource">
    </div>

    <div class="RenderCode">
      <span class="fileName">{{ fileName }}</span>
      <div class="codeForSave">
      <pre><?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class {{className}}Resource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            {{ simpleItems.filter(e => e.inResource).map(e => `'${getJsonName(e)}' => $this->${getJsonName(e)},`).join('\n\t    ') }}
            {{ referenceItemsList.filter(e => e.inResource).map(e => `'${getJsonName(e)}' => ${getClassName(e)}Resource::collection($this->whenLoaded('${getJsonName(e)}')),`).join('\n\t    ') }}
            {{ referenceItems.filter(e => e.inResource).map(e => `'${getJsonName(e)}' => ${getClassName(e)}Resource::collection($this->whenLoaded('${getJsonName(e)}')),`).join('\n\t    ') }}
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
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
import {getClassName, getJsonName} from "@/views/ModelEditor/LaravelSeederFactory.vue";

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
export default class LaravelResource extends VueBase {
  nameClass!: string
  items!: PropItem[]
  model!: Model

  get fileName() {
    return this.className + 'Resource.php'
  }

  get tableName() {
    return _.snakeCase(this.nameClass)
  }

  get className() {
    return UpperFirstLetter(_.camelCase(this.nameClass))
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

  getJsonName = getJsonName;
  getClassName = getClassName;
}
</script>

<style scoped lang="scss">
.form {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(auto-fill, 50px) 50px;
  grid-gap: 1rem;
  min-height: auto !important;

  .inline {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 300px auto 300px 1fr;
    grid-gap: 1rem;
    align-items: center;
  }
}
</style>