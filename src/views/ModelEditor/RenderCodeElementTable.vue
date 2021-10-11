<template>
  <div class="RenderCode">
    <span class="fileName">{{ fileName }}</span>
    <div class="codeForSave">
      <!--      <span>import '../_imports.dart';</span><br><br>-->
      <pre v-text="getElementUiTable(bloc, {postfix: ''})"></pre>
    </div>
  </div>
</template>

<script lang="ts">
import {PropItem} from "./RenderCodeLineType";
import {Component, Vue} from 'vue-property-decorator';
import {JsonData, Prop} from "@/utils/interfaces";
import _ from "lodash";
import {getInterfaceTS} from "@/utils/getInterfaceTS";
import {getElementUiTable} from "@/utils/getElementUiTable";

const VueBase = Vue.extend({
  props: {
    nameClass: {type: String, default: ''},
    items: {
      type: Array,
      default: () => [],
    },
  },
})

@Component({})
export default class RenderCodeElementTable extends VueBase {
  nameClass!: string
  items!: PropItem[]

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

  get bloc(): JsonData {
    return {
      name: this.nameClass + 'Table',
      state: {
        props: this.stateProps,
      },
      events: [],
      bloc: {
        case_event: {},
        onError: false,
      },
      actionProp: {
        name: '',
        typeName: '',
      }
    }
  }

  get fileName() {
    return _.snakeCase(this.nameClass) + '_table.vue'
  }

  getElementUiTable = getElementUiTable;
}
</script>

<style scoped lang="scss">
</style>