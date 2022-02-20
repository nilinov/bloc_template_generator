<template>
  <div class="form">
    <div class="inline" v-for="item of model.props">
      <TextBox placeholder="Name" :value="item.name" disabled/>
      <el-autocomplete
          class="inline-input"
          v-model="item.faker"
          :fetch-suggestions="querySearchModel"
          placeholder="Faker select"
          @select="(res) => handleSelectModel(item, res)"
      ></el-autocomplete>
      <TextBox placeholder="Faker append" v-model="item.fakerAppend"/>
    </div>

    <div class="RenderCode">
      <span class="fileName">{{ fileName }}</span>
      <div class="codeForSave">
      <pre><?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\{{className}};


class {{className}}Factory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = {{className}}::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            {{ model.props.filter(e => e.faker).map(e => `'${e.name}' => ${e.faker.replace('?', e.fakerAppend)},`).join('\n\t    ') }}
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
import SelectBox from "@/components/SelectBox.vue";
import {fuzzy} from "@/main";

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
export default class LaravelMigration extends VueBase {
  nameClass!: string
  items!: PropItem[]
  model!: Model

  get fileName() {
    return this.className + 'Factory.php'
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

  options = [
      '$this->faker->userName',
      '$this->faker->name()',
      '$this->faker->safeEmail',
      '$this->faker->unique()->safeEmail()',
      '$this->faker->company',
      '$this->faker->phoneNumber',
      '$this->faker->sentence(4)',
      '$this->faker->sentence',
      '$this->faker->boolean',
      '$this->faker->randomElement([?])',
      '$this->faker->numberBetween(?)',
      '?'
  ]

  querySearchModel(queryString: string, cb: Function) {
    console.log(queryString)
    const models: string[] = this.options;
    var results = queryString ? models.filter(model => fuzzy(model.toLowerCase(), queryString.toLowerCase())) : models;

    cb(results.map(model => ({value: model, item: model})));
  }

  handleSelectModel(item: PropItem, val: { value: string, item: string }) {
    console.log('handleSelectModel')
    item.faker = val.item;
    // item.faker = val.item;
  }


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
    grid-template-columns: 300px 300px 300px;
    grid-gap: 1rem;

  }
}
</style>