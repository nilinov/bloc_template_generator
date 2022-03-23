<template>
  <div class="generate-screen">

    <div class="RenderCode">
      <span class="fileName">{{ fileName }}</span>
      <div class="codeForSave">
        <pre v-if="typeModule === 'list'">{{
            getCode({
              modelName: typeLabel,
              apis: allApiFunctionsByTag,
              vuexModuleName: nameBloc
            })
          }}</pre>
        <pre v-if="typeModule === 'entity'">{{
            getCodeEntity({
              modelName: typeLabel,
              apis: allApiFunctionsByTag,
              vuexModuleName: nameBloc
            })
          }}</pre>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {TextBox, SelectBox} from "@/components";
import {Component, Vue} from "vue-property-decorator";
import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";
import {downloadURI, fuzzy} from "@/main";
import {getStoreListTsCode} from "@/views/StateEditor/getStoreListTsCode";
import {getClassName} from "@/views/ModelEditor/LaravelSeederFactory.vue";
import {getStoreEntityTsCode} from "@/views/StateEditor/getStoreEntityTsCode";

export enum TypeModule {
  list = 'list',
  entity = 'entity',
  custom = 'custom',
}

@Component({
  components: {TextBox, SelectBox}, props: {
    nameBloc: String,
    typeLabel: String,
    typeModule: String,
    tag: String,
  }
})
export default class StateEditorTs extends Vue {
  nameBloc!: string;
  typeLabel!: string;
  typeModule!: TypeModule;
  tag!: string;

  get allApiFunctions(): ApiFunction[] {
    return this.$store.getters.allApiFunctions ?? [];
  }

  get allApiFunctionsByTag(): ApiFunction[] {
    return ((this.$store.getters.allApiFunctions ?? []) as ApiFunction[]).filter(e => e.tag == this.tag)
  }

  get fileName() {
    if (this.typeModule == TypeModule.list)
      return getClassName(`${this.nameBloc}_module`) + '.ts'
    if (this.typeModule == TypeModule.entity)
      return getClassName(`${this.nameBloc}_single_module`) + '.ts'
    return getClassName(`${this.nameBloc}_module`) + '.ts'
  }

  getCode = getStoreListTsCode
  getCodeEntity = getStoreEntityTsCode

  download(name: string, text: string) {
    downloadURI(name, text);
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style";

.generate-screen {
  background-color: $color-white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}


.RenderCode {
  width: 100%;
}

</style>
