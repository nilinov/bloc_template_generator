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

  <el-input type="textarea" placeholder="URL сервера" v-model="serverUrl"> </el-input>

  <el-input type="textarea" :disabled="!selectedApiFunction" v-model="mockJSON">

  </el-input>

  <div v-for="key in pathParams">
    <el-input :placeholder="key" v-model="paramsReplace[key]"> </el-input>
  </div>

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
  selectedApiFunction: ApiFunction | null = null;
  uuid = "";
  mockJSON = "[]";

  mockParse = [];

  serverUrl = ''

  paramsReplace: {[x:string]: string} = {};

  created() {
    // this.uuid = this.$route.params.uuid;
    if (localStorage.mockApiFunctionUUID && localStorage.mock && localStorage.serverUrl) {
      this.mockJSON = localStorage.mock;
      this.uuid = localStorage.mockApiFunctionUUID;
      this.serverUrl = localStorage.serverUrl;
    }
    if (localStorage.mockParamsReplace) {
      this.paramsReplace = JSON.parse(localStorage.mockParamsReplace);
    }
  }

  get allModels(): Model[] {
    return this.$store.getters.allModelsClasses;
  }

  get allApiFunction(): ApiFunction[] {
    return this.$store.getters.allApiFunctions;
  }

  get result() {
    if (this.selectedApiFunction?.isList) {
      return generateKrakendList(this.mockParse, this.selectedApiFunction, this.paramsReplace, this.serverUrl.split('\n'))
    } else if (this.selectedApiFunction) {
      return generateKrakendItem(this.mockParse, this.selectedApiFunction, this.paramsReplace, this.serverUrl.split('\n'))
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

  get pathParams() {
    return this.selectedApiFunction?.path.split('/').filter((e:string) => e[0] == ':').map((e:string) => e)
  }

  @Watch('mockJSON')
  handleChange1() {
    try {
      this.mockParse = JSON.parse(this.mockJSON);
      localStorage.mock = this.mockJSON;
    } catch (e) {
      this.mockParse = []
    }
  }

  @Watch('allApiFunction')
  handleChange2() {
    this.selectedApiFunction = this.allApiFunction.find(e => e.uuid == this.uuid) ?? null;
  }

  @Watch('uuid')
  handleChange3() {
    this.selectedApiFunction = this.allApiFunction.find(e => e.uuid == this.uuid) ?? null;
    localStorage.mockApiFunctionUUID = this.uuid;
  }

  @Watch('paramsReplace', {deep: true})
  handleChange4(val: any) {
    localStorage.mockParamsReplace = JSON.stringify(val);
  }

  @Watch('serverUrl')
  handleChange5(val: any) {
    localStorage.serverUrl = this.serverUrl;
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