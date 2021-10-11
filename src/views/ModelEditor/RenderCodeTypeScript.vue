<template>
  <div class="RenderCode">
    <span class="fileName">{{ fileName }}</span>
    <div class="codeForSave">
      <!--      <span>import '../_imports.dart';</span><br><br>-->
      <pre v-if="!isEnum" v-text="getInterfaceTS(bloc, {postfix: ''})"></pre>
      <pre v-if="isEnum" v-text="getEnumTS(bloc, {postfix: ''})"></pre>
    </div>
  </div>
</template>

<script lang="ts">
import {PropItem} from "./RenderCodeLineType";
import {Component, Vue} from 'vue-property-decorator';
import {JsonData, Prop} from "@/utils/interfaces";
import _ from "lodash";
import {getEnumTS, getInterfaceTS} from "@/utils/getInterfaceTS";

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
    isEnum: {
      type:Boolean,
      default: false,
    }
  }
})
export default class RenderCodeTypeScript extends VueBase {
  nameClass!: string
  items!: PropItem[]
  isEnum!: boolean

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
    return _.snakeCase(this.nameClass) + '.ts'
  }

  getInterfaceTS = getInterfaceTS;
  getEnumTS = getEnumTS;
}
</script>

<style scoped lang="scss">
</style>