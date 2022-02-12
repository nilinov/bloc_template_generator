<template>
  <div class="RenderCode">
    <span class="fileName">{{ fileName }}</span>
    <div class="codeForSave">
      <pre><?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * {{model.desc}}
 *
 * {{ [...simpleItems, ...enumItems].map(e => `@property ${getPhpType(e)} ${e.name} - ${e.desc}`).join('\n * ') }}
 * {{ referenceItemsList.map(e => `@property mixed[] ${e.name} - ${e.desc}`).join('\n *') }}
 * {{ referenceItems.map(e => `@property mixed ${e.name} - ${e.desc}`).join('\n *') }}
*/
class {{className}} extends Model
{
    use HasFactory;

    protected $table = '{{tableName}}';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        {{ [...simpleItems, ...enumItems].map(e => e.name).filter(e => e != 'id').map(e => `"${e}"`).join(',\n\t') }}
    ];

    {{ referenceItemsList.map(e => `public function ${e.name}()
    {
        return $this->belongsToMany(\\App\\Models\\${getNameClass(e.type)}::class);
    }`).join('\n\n\t') }}

    {{ referenceItems.map(e => `public function ${e.name}()
    {
        return $this->belongsTo(\\App\\Models\\${getNameClass(e.type)}::class);
    }`).join('\n\n\t') }}

}

      </pre>
    </div>
  </div>
</template>

<script lang="ts">
import {
  renderCodeLineType,
  renderCodeLinePropConstr,
  renderCodeCopyWithContent,
  renderCodeCopyWithParams, PropItem, Model
} from "./RenderCodeLineType";
import getStateDefaultCode from "@/utils/getStateDefaultCode";
import { Component, Vue } from 'vue-property-decorator';
import {JsonData, Prop} from "@/utils/interfaces";
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

export function getPhpType(item: PropItem) {
  switch (item.type) {
    case 'String': return 'string';
    case 'int': return 'integer';
    case 'double': return 'float';
    case 'DateTime': return '\\DateTime';
    default: return 'mixed';
  }
}

@Component({})
export default class LaravelModel extends VueBase {
  nameClass!: string
  items!: PropItem[]
  model!: Model

  get fileName() {
    return _.snakeCase(this.nameClass) + '.php'
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

  getPhpType = getPhpType
}
</script>

<style scoped lang="scss">
</style>