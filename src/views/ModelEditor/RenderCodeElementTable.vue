<template>
  <div class="RenderCode">
    <span class="fileName">{{ fileName }}</span>
    <div class="codeForSave">
      <!--      <span>import '../_imports.dart';</span><br><br>-->
      <pre v-if="model && !isForm" v-text="getTypeScriptTable(model, {postfix: ''})"></pre>
      <pre v-if="model && isForm" v-text="getTypeScriptForm(model, {postfix: ''})"></pre>
    </div>
  </div>
</template>

<script lang="ts">
import {Model, PropItem} from "./RenderCodeLineType";
import {Component, Vue} from 'vue-property-decorator';
import {JsonData, Prop} from "@/utils/interfaces";
import _ from "lodash";
import {getTypeScriptTable} from "@/utils/getTypeScriptTable";
import {getTypeScriptForm} from "@/utils/getTypeScriptForm";

const VueBase = Vue.extend({
  props: {
    nameClass: {type: String, default: ''},
    items: {
      type: Array,
      default: () => [],
    },
  },
})

@Component({
  props: {
    nameClass: String,
    isForm: Boolean
  }
})
export default class RenderCodeElementTable extends VueBase {
  nameClass!: string
  items!: PropItem[]
  isForm!: boolean

  get allModels() : Model[] {
    return this.$store.getters.allModelsItems;
  }

  get model() {
    return (this.allModels).find(e => e.name == this.nameClass)
  }

  get stateProps() {
    const res: { [x: string]: Prop } = {};
    this.items.map((e: PropItem) => {
      const isClass = (this.$store.getters.allModelsClasses as string[]).includes(e.type);

      res[e.name] = {
        name: e.name,
        typeName: e.type,
        typeTemplate: {
          class: isClass,
          [e.type.toLowerCase()]: true,
          nullable: e.nullable,
        },
        default: e.defaultValue,
      }
    })

    return res;
  }

  get fileName() {
    return _.snakeCase(this.nameClass) + (this.isForm ? '_form.ts' : '_columns.ts')
  }

  getTypeScriptTable = getTypeScriptTable;
  getTypeScriptForm = getTypeScriptForm;
}
</script>

<style scoped lang="scss">
</style>
