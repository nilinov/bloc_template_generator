<template>
  <div class="RenderCode">
    <span class="fileName">{{ fileName }}</span>
    <div class="codeForSave">
      <pre>{{ code }}</pre>
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
import {Component, Vue} from 'vue-property-decorator';
import {BlocState, JsonData, Prop} from "@/utils/interfaces";
import {getEnumContent} from '@/utils/getStateDefaultCode';
import _ from "lodash";

@Component({
  props: {
    nameClass: String,
    /** @type Model */
    model: {
      type: Object,
      default: () => [],
    },
    /** @type PropItem[] */
    items: {
      type: Array,
      default: () => [],
    },
  },
})
export default class ExportCode extends Vue {
  nameClass!: string
  items!: PropItem[]
  model!: Model

  get fileName() {
    return _.snakeCase(this.nameClass) + '.json'
  }

  get code() {
    return JSON.stringify(this.model);
  }
}
</script>

<style scoped lang="scss">
pre {
  white-space: pre-wrap;       /* css-3 */

}
</style>