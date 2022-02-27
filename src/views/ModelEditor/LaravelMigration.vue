<template>
  <div class="RenderCode">
    <span class="fileName">{{ fileName }}</span>
    <div class="codeForSave">
      <pre><?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('{{tableName}}', function (Blueprint $table) {
            {{ items.map(e => getSQLType(e, allModels)).join('\n\t    ') }}
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('{{ tableName }}');
    }
};

      </pre>
    </div>
  </div>
</template>

<script lang="ts">
import {Model, PropItem} from "./RenderCodeLineType";
import {Component, Vue} from 'vue-property-decorator';
import _ from "lodash";
import {UpperFirstLetter} from "@/utils/utils";
import {simpleTypes} from "@/views/ApiClient/generate_code_api_client";

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

export function getSQLType(item: PropItem, allModels: Model[]) {
  if (item.name == 'id') {
    return `$table->id();`
  }

  switch (item.type) {
    case 'String':
      return `$table->string('${getJsonName(item)}');`;
    case 'int':
      return `$table->integer('${getJsonName(item)}');`;
    case 'bool':
      return `$table->boolean('${getJsonName(item)}');`;
    case 'double':
      return `$table->double('${getJsonName(item)}');`;
    case 'DateTime':
      return `$table->date('${getJsonName(item)}');`;
    default:
      const model = allModels.find(e => e.name == item.name || e.name == `List<${item.name}>`)
      if (model) {
        if (model.name.indexOf('List<') == 0) {
          //TODO Тут зависимость один ко многим
          return `$table->integer('${getJsonName(item)}_id')->unsigned(); \n\t\t$table->foreign('${getJsonName(item)}_id')->references('id')->on('${getJsonName(item)}s');`
        } else {
          if (model.isEnum) {
            return `$table->enum('template', ["Companies","CompleteSet","Moving","LoadingUnloading"]);`
          }
        }
      }
      return 'mixed';
  }
}

@Component({})
export default class LaravelMigration extends VueBase {
  nameClass!: string
  items!: PropItem[]
  model!: Model

  get fileName() {
    const index = this.allModels.findIndex(e => e.name == this.model.name)
    return `2021_12_27_042126_${index}_create_` + _.snakeCase(this.nameClass) + '.php'
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

  getSQLType = getSQLType
}
</script>

<style scoped lang="scss">
</style>
