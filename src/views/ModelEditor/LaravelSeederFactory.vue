<template>
  <div class="form">
    <div class="inline">
      <TextBox placeholder="Count create" v-model="model.seederCount"/>
    </div>

    <div class="RenderCode">
      <span class="fileName">{{ fileName }}</span>
      <div class="codeForSave">
      <pre><?php

namespace Database\Seeders;

use App\Models\{{className}};
use Illuminate\Database\Seeder;

class {{className}}Seeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        {{className}}::factory()->count({{ model.seederCount }})->create();
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
import SelectBox from "@/components/SelectBox.vue";

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

export function getJsonName(item: PropItem) {
  return item.jsonField ?? item.name
}

@Component({
  components: {SelectBox, TextBox}
})
export default class LaravelSeederFactory extends VueBase {
  nameClass!: string
  items!: PropItem[]
  model!: Model

  get fileName() {
    return this.className + 'Seeder.php'
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
}
</script>

<style scoped lang="scss">
.form {
  display: grid;
  grid-template-columns: 1fr;
  //grid-template-rows: repeat(auto-fill, 50px) 50px;
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