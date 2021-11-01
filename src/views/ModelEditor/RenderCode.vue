<template>
  <div class="RenderCode">
    <span class="fileName">{{ fileName }}</span>
    <div class="codeForSave">
      <span>import '../_imports.dart';</span><br><br>
      <span> class {{ nameClass }} { </span>

      <pre v-text="stateCode(bloc, {postfix: ''})"></pre>

      <span><br> }</span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  renderCodeLineType,
  renderCodeLinePropConstr,
  renderCodeCopyWithContent,
  renderCodeCopyWithParams, PropItem
} from "./RenderCodeLineType";
import getStateDefaultCode from "@/utils/getStateDefaultCode";
import { Component, Vue } from 'vue-property-decorator';
import {JsonData, Prop} from "@/utils/interfaces";
import _ from "lodash";

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
export default class RenderCode extends VueBase {
  nameClass!: string
  items!: PropItem[]

  get stateProps() {
    const res: {[x: string]: Prop} = {};
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
        jsonField: e.jsonField
      }
    })

    return res;
  }

  get bloc(): JsonData {
    return {
      name: this.nameClass,
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
    return _.snakeCase(this.nameClass) + '.dart'
  }

  renderCodeLineType = renderCodeLineType;
  renderCodeLinePropConstr = renderCodeLinePropConstr;
  renderCodeCopyWithParams = renderCodeCopyWithParams;
  renderCodeCopyWithContent = renderCodeCopyWithContent;
  stateCode = getStateDefaultCode;
}
</script>

<style scoped lang="scss">
</style>