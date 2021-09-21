<template>
  <div class="RenderCode">
    <span> class {{ nameClass }} { </span>

    <pre v-text="stateCode(bloc, {postfix: ''})"></pre>

    <span><br> }</span>
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
export default class RenderCode extends Vue {
  get stateProps() {
    const res = {};
    this.items.map(e => {
      const isClass = (this.$store.getters.allModelsClasses as string[]).includes(e.type);

      res[e.name] = {
        name: e.name,
        typeName: e.type,
        typeTemplate: {
          class: isClass,
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

  renderCodeLineType = renderCodeLineType;
  renderCodeLinePropConstr = renderCodeLinePropConstr;
  renderCodeCopyWithParams = renderCodeCopyWithParams;
  renderCodeCopyWithContent = renderCodeCopyWithContent;
  stateCode = getStateDefaultCode;
}
</script>

<style scoped lang="scss">
.RenderCode {
  padding: 1rem;
  background-color: $color-gray-100;
}

pre {
  margin: 0;
}
</style>