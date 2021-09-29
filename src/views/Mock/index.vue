<template>
<div class="MockEditor">
  <el-select v-model="uuid" placeholder="Api request">
    <el-option
        v-for="item in allApiFunction"
        :key="item.uuid"
        :label="item.name"
        :value="item.uuid">
    </el-option>
  </el-select>

  <el-input type="textarea" :disabled="!selectedApiFunction" v-model="mockJSON">

  </el-input>

  <div class="code" v-if="result">
    <span class="fileName">{{nameFile}}</span>
    <pre v-text="includeText"></pre>
    <pre class="codeForSave" v-text="result"></pre>
  </div>

</div>
</template>

<script lang="ts">

import Component from "vue-class-component";
import {Vue, Watch} from "vue-property-decorator";
import {Model} from "@/views/ModelEditor/RenderCodeLineType";
import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";
import {generateKrakendItem, generateKrakendList} from "@/views/Mock/generate_krakend";
import _ from "lodash/fp";

@Component({})
export default class MockEditor extends Vue{
  name: "index"

  selectedApiFunction: ApiFunction | null = null;
  uuid = "";
  mockJSON = "[]";

  mockParse = [];

  created() {
    this.uuid = this.$route.params.uuid;
  }

  get allModels(): Model[] {
    return this.$store.getters.allModelsClasses;
  }

  get allApiFunction(): ApiFunction[] {
    return this.$store.getters.allApiFunctions;
  }

  get result() {
    if (this.selectedApiFunction?.isList) {
      return generateKrakendList(this.mockParse, this.selectedApiFunction)
    } else {
      return generateKrakendItem(this.mockParse, this.selectedApiFunction)
    }
  }

  get nameFile() {
    if (this.selectedApiFunction) {
      return `${_.snakeCase(this.selectedApiFunction.name)}.tmpl`;
    }
  }

  get includeText() {
    if (this.selectedApiFunction) {
      return `
  "endpoints": [
    {{ template "${this.nameFile}" .service }},
  ]
      `;
    }
  }

  @Watch('mockJSON')
  handleChange1() {
    try {
      this.mockParse = JSON.parse(this.mockJSON);
    } catch (e) {
      this.mockParse = []
    }
  }

  @Watch('allApiFunction')
  handleChange2() {
    this.selectedApiFunction = this.allApiFunction.find(e => e.uuid == this.uuid);
  }

  @Watch('uuid')
  handleChange3() {
    this.selectedApiFunction = this.allApiFunction.find(e => e.uuid == this.uuid);
  }

  querySearchModel(queryString: string, cb: Function) {
    console.log(queryString)
    const models: ApiFunction[] = this.$store.getters.allApiFunctions;
    var results = queryString ? models.filter(this.handleFilterModel(queryString)) : models;

    cb(results.map(model => ({value: model.name, item: model})));
  }

  handleFilterModel(queryString: string) {
    return (model: ApiFunction) => {
      return (model.name.toLowerCase().includes(queryString.toLowerCase()));
    };
  }
}
</script>

<style scoped lang="scss">
.MockEditor {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;

  pre {
    overflow: hidden;
    padding: 1rem;

    background-color: $color-gray-100;

    //max-width: 90vw;


    & + pre {
      margin-top: 1rem;
    }
  }

}
</style>