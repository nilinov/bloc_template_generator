<template>
  <el-col :span="24" class="code">
    <el-tabs v-model="lang">
      <el-tab-pane label="Dart" name="dart">
        <template v-if="lang === 'dart'">
          <span class="fileName">api.dart</span>
          <pre class="codeForSave" v-text="code"></pre>
        </template>
      </el-tab-pane>
      <el-tab-pane label="TypeScript" name="typescript_api_client">
        <template v-if="lang === 'typescript_api_client'">
          <span class="fileName">api.ts</span>
          <pre class="codeForSave" v-text="code"></pre>
        </template>
      </el-tab-pane>
      <el-tab-pane label="Swagger" name="swagger">
        <template v-if="lang === 'swagger'">
          <span class="fileName">swagger.json</span>
          <pre class="codeForSave" v-text="code"></pre>
        </template>
      </el-tab-pane>
      <el-tab-pane label="Laravel" name="laravel">
        <template v-if="lang === 'laravel'">
          <LaravelTabContent/>
        </template>
      </el-tab-pane>
    </el-tabs>
  </el-col>

</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import {Model} from "@/views/ModelEditor/RenderCodeLineType";
import FormEdit from "@/views/ApiClient/FormEdit.vue";
import {ApiFunction, generateCodeApiClient} from "@/views/ApiClient/generate_code_api_client";
import {ACTIONS_API_FUNCTIONS} from "@/store/api_functions";
import {generateSwaggerFile} from "@/views/ApiClient/generate_swagger_file";
import LaravelTabContent from "@/views/ApiClient/components/LaravelTabContent.vue";
import {emptyApiFunction} from "@/utils/emptyApiFunction";
import {generateCodeApiClientTs} from "@/views/ApiClient/generate_code_api_client_ts";
import {snakeCase} from "lodash";

@Component({
  components: {LaravelTabContent, FormEdit}
})
export default class ApiExport extends Vue {

  lang = 'typescript_api_client'
  // lang = 'swagger'
  // lang = 'dart'
  // lang = 'laravel'

  get allFunctions(): ApiFunction[] {
    return this.$store.getters.allApiFunctions ?? [];
  }

  get tags(): string[] {
    return this.$store.getters.tagsApiFunctions ?? [];
  }

  code = '';

  dialogVisible = false;

  resource = {
    modelUUID: '',
    title: ''
  }

  created() {
    if (!this.$store.state.isPending)
      this.updateCode();
  }

  emptyApiFunction = emptyApiFunction

  get allModels(): Model[] {
    return this.$store.state.models;
  }

  @Watch('allFunctions')
  handleChange1() {
    this.updateCode();
  }

  @Watch('allModels')
  handleChange2() {
    this.updateCode();
  }

  @Watch('lang')
  handleChange3() {
    this.updateCode();
  }

  selectTag = '';

  updateCode() {
    console.log(this.allModels)
    if (this.lang == 'dart') {
      this.code = generateCodeApiClient(this.allFunctions, this.allModels);
    } else if (this.lang == 'typescript_api_client') {
      this.code = generateCodeApiClientTs(this.allFunctions, this.allModels);
    } else if (this.lang == 'laravel') {
      this.code = "";
    } else {
      this.code = generateSwaggerFile(this.allModels, this.allFunctions);
    }
  }

  handleUpdate(item: ApiFunction) {
    const index = this.allFunctions.findIndex(e => e.uuid == item.uuid);
    if (index != -1) {
      this.$store.dispatch(ACTIONS_API_FUNCTIONS.SET, item)
    }
  }

  handleRemove(func: ApiFunction) {
    const index = this.allFunctions.findIndex(e => e.uuid == func.uuid)
    if (index != -1) {
      this.$store.dispatch(ACTIONS_API_FUNCTIONS.REMOVE, func.uuid)
    }
  }

  handleCreateResource() {
    const model = this.allModels.find(e => e.uuid == this.resource.modelUUID)
    const title = this.resource.title.toLowerCase()
    if (model) {
      const path = snakeCase(model.name).split('_').join('-')

      this.allFunctions.push({
        ...emptyApiFunction(this.allFunctions.length),
        desc: `Получить список ${title}`,
        isList: true,
        hasPaginate: true,
        path: `/api/v1/${path}`,
        modelUUID: model.uuid,
        name: `get${model.name}`,
        tag: model.name,
      })

      this.allFunctions.push({
        ...emptyApiFunction(this.allFunctions.length),
        desc: `Создать ${title}`,
        method: 'POST',
        isList: false,
        path: `/api/v1/${path}`,
        modelUUID: model.uuid,
        name: `create${model.name}`,
        tag: model.name,
        params: [
          {
            name: 'payload',
            type: model.name,
            place: 'body'
          }
        ]
      })

      this.allFunctions.push({
        ...emptyApiFunction(this.allFunctions.length),
        desc: `Обновить ${title}`,
        method: 'PUT',
        isList: false,
        path: `/api/v1/${path}/{id}`,
        modelUUID: model.uuid,
        name: `update${model.name}`,
        tag: model.name,
        params: [
          {
            name: 'id',
            type: 'int',
            place: 'in-path'
          },
          {
            name: 'payload',
            type: model.name,
            place: 'body'
          }
        ]
      })

      this.allFunctions.push({
        ...emptyApiFunction(this.allFunctions.length),
        desc: `Удалить ${title}`,
        method: 'DELETE',
        isList: false,
        path: `/api/v1/${path}/{id}`,
        modelUUID: model.uuid,
        name: `delete${model.name}`,
        tag: model.name,
        params: [
          {
            name: 'id',
            type: 'int',
            place: 'in-path'
          },
        ]
      })

      this.dialogVisible = false;
    }
  }
}
</script>

<style scoped lang="scss">
.code {
  padding: 0 1rem;

  span {
    padding: .2rem 1rem;
  }

  pre {
    overflow: hidden;
    padding: 1rem;

    background-color: $color-gray-100;
  }
}

</style>
