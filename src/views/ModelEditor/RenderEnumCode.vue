<template>
  <div class="RenderCode">
    <span class="fileName">{{ nameClass }}.dart</span>
    <div class="codeForSave">
      <span>import '../_imports.dart';</span><br><br>
      <span> enum {{ nameClass }} { </span>
      <pre v-text="getEnumContent(bloc)"></pre>
      <span><br> } </span>
      <br><br>
      <span>{{ nameExamplar }}ToJson({{ nameClass }} {{ nameExamplar }}) {</span>
      <br>
      <span>&nbsp;&nbsp; return {{ nameExamplar }}.toString();</span>
      <br>
      <span>}</span>
      <br>
      <br>
      <pre>
{{ nameExamplar }}FromJson(String {{ nameExamplar }}) {
  switch ({{ nameExamplar }}) {
<span v-for="item of items">&nbsp;&nbsp; case '{{ nameExamplar }}.{{ item.name }}': return {{ nameClass }}.{{
    item.name
  }};<br></span>
  }

  return {{ nameClass }}.{{ items[0].name }};
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
  renderCodeCopyWithParams
} from "./RenderCodeLineType";
import getStateDefaultCode from "@/utils/getStateDefaultCode";
import Vue from "vue";
import Component from "vue-class-component";
import {JsonData} from "@/utils/interfaces";
import {getEnumContent} from '@/utils/getStateDefaultCode';
import _ from "lodash";

@Component({
  props: {
    nameClass: String,

    /** @type PropItem[] */
    items: {
      type: Array,
      default: () => [],
    },
  },
})
export default class RenderEnumCode extends Vue {
  get stateProps() {
    const res = {};
    this.items.map(e => {
      res[e.name] = {
        name: e.name,
        typeTemplate: {
          [e.type.toLowerCase()]: true,
        },
        default: e.defaultValue,
      }

      if (e.nullable) {
        res[e.name].typeTemplate.nullable = true;
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
      actionProp: false
    }
  }

  get nameExamplar() {
    return _.camelCase(this.nameClass);
  }

  renderCodeLineType = renderCodeLineType;
  renderCodeLinePropConstr = renderCodeLinePropConstr;
  renderCodeCopyWithParams = renderCodeCopyWithParams;
  renderCodeCopyWithContent = renderCodeCopyWithContent;
  stateCode = getStateDefaultCode;
  getEnumContent = getEnumContent;
}
</script>

<style scoped lang="scss">

</style>