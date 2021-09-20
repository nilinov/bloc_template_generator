<template>
  <div class="RenderCode">
    <span> class {{ nameClass }} { </span>


    <pre v-text="stateCode(bloc)"></pre>

    <span><br> }</span>
  </div>
</template>

<script>
import {
  renderCodeLineType,
  renderCodeLinePropConstr,
  renderCodeCopyWithContent,
  renderCodeCopyWithParams
} from "./RenderCodeLineType";
import getStateDefaultCode from "@/utils/getStateDefaultCode";

export default {
  name: "RenderCode",
  props: {
    nameClass: String,

    /** @type PropItem[] */
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    stateProps() {
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
    },
    bloc() {
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
  },
  methods: {
    renderCodeLineType: renderCodeLineType,
    renderCodeLinePropConstr: renderCodeLinePropConstr,
    renderCodeCopyWithParams: renderCodeCopyWithParams,
    renderCodeCopyWithContent: renderCodeCopyWithContent,
    stateCode: getStateDefaultCode,
  }
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