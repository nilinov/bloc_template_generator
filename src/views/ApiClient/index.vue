<template>
  <div>
    <el-row v-if="!$store.state.isPending">
      <el-col :span="4" v-if="false">
        <div class="grid-content bg-purple">
          <template v-if="allFunctions.length === 0">
            Нет запросов
          </template>
        </div>
      </el-col>
      <el-col :span="8">
        <template v-for="(item, index) of allFunctions">
          <FormEdit :item="item" @remove="handleRemove" @update="handleUpdate" :key="`form-${item.uuid}`"/>
          <br>
          <hr>
          <br>
        </template>
        <el-button @click="allFunctions.push(emptyApiFunction)">Добавить</el-button>
      </el-col>
      <el-col :span="16" class="code">
        <el-tabs v-model="lang">
          <el-tab-pane label="Dart" name="dart">
            <template v-if="lang === 'dart'">
              <span class="fileName">api.dart</span>
              <pre class="codeForSave" v-text="code"></pre>
            </template>
          </el-tab-pane>
          <el-tab-pane label="Swagger" name="swagger">
            <template v-if="lang === 'swagger'">
              <span class="fileName">swagger.json</span>
              <pre class="codeForSave" v-text="code"></pre>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import {Model, PropItem} from "@/views/ModelEditor/RenderCodeLineType";
import FormEdit from "@/views/ApiClient/FormEdit.vue";
import {generateCodeApiClient, ApiFunction, ApiFunctionParam} from "@/views/ApiClient/generate_code_api_client";
import {ACTIONS_API_FUNCTIONS, MUTATIONS_API_FUNCTIONS} from "@/store/api_functions";
import {getDataBaseRef} from "@/database";
import {getPropNameFromList} from "@/utils/utils";

@Component({
  components: {FormEdit}
})
export default class ApiClient extends Vue {

  lang = 'dart'

  get allFunctions(): ApiFunction[] {
    return this.$store.getters.allApiFunctions ?? [];
  }

  code = '';

  created() {
    if (!this.$store.state.isPending)
      this.updateCode();
  }

  get emptyApiFunction(): ApiFunction {
    return {
      uuid: Math.random().toString(),
      name: '',
      path: '/',
      method: 'GET',
      modelUUID: '',
      isList: false,
      isMock: true,
      hasFilter: false,
      hasPaginate: false,
      hasSearch: false,
      params: [],
    }
  }

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

  updateCode() {
    console.log(this.allModels)
    if (this.lang == 'dart') {
      this.code = generateCodeApiClient(this.allFunctions, this.allModels);
    } else {
      const keysModels: { [x: string]: any } = {}

      for (let model of this.allModels) {
        keysModels[model.name] = this.getSchemaDescByClass(model);
      }

      const path: {[x: string]: any} = {}

      for (const func of this.allFunctions) {
        const model = this.allModels.find(model => model.uuid == func.modelUUID);

        path[func.path.split('/').map(e => e[0] === ':' ? `{${e.replace(':', '')}}` : e).join('/')] = {
          "get": {
            "summary": `function ${func.name}`,
            "responses": {
              "200": {
                "description": "",
                "schema": this.getSchemaLinkByClass(model)
              }
            },
          }
        }
      }


      this.code = JSON.stringify({
        "swagger": "2.0",
        "info": {
          "version": "1.0.0",
          "title": "Mad Team swagger",
          "description": ""
        },
        "host": "ovz5.j1121565.m719m.vps.myjino.ru",
        "schemes": ["http"],
        "consumes": ["application/json"],
        "produces": ["application/json"],
        "paths": path,
        "definitions": keysModels
      }, null, 2);
    }
  }

  getSchemaDescByClass(model?: Model) {
    const props: { [x: string]: any } = {};
    console.log({props})

    for (const prop of model?.props ?? []) {
      const _name = this.getNameClassSingle(prop.name);
      const model = this.allModels.find(e => e.name == prop.type);
      const name = model?.name || _name;

      const isArray = name?.indexOf('List<') == 0;

      if (!model || !model?.isEnum) {

        let type: any = prop.type.toLowerCase();
        let isModel = false;

        if (model) {
          type = {"$ref": `#/definitions/${this.getNameClassSingle(model?.name ?? '')}`};
          isModel = true;
        }

        if (prop.type.indexOf('List<') == 0) {
          type = {"$ref": `#/definitions/${this.getNameClassSingle(prop.type ?? '')}`};
          isModel = true;
        }

        switch (type) {
          case 'int':
            type = "integer";
            break;
          case 'datetime':
            type = "string";
            break;
          case 'double':
            type = "number";
            break;
          case 'bool':
            type = "boolean";
            break;
        }
        if (isModel) {
          props[name] = type
        } else {
        props[name] = {
          "type": type,
        }
        }
      }
    }

    return {
      "type": "object",
      "properties": props,
    }
  }

  getNameClassSingle(name: string) {
    if (name?.indexOf('List<') == 0) return name?.substr(5, name?.length - 6)

    return name;
  }

  getSchemaLinkByClass(model?: Model) {
    if (model?.isEnum) return {
      "type": "string",
      "enum": model.props.map(e => e.name),
    }

    if (model?.name?.indexOf('List<') == 0) {
      return {
        "type": "array",
        "items": `$ref: '#/definitions/${this.getNameClassSingle(model.name ?? '')}`
      }
    }

    return {"$ref": `#/definitions/${model?.name}`}
  }

  getPropsByClass(model?: Model) {

  }

  handleUpdate(item: ApiFunction) {
    const index = this.allFunctions.findIndex(e => e.uuid == item.uuid);
    if (index != -1) {
      this.$store.dispatch(ACTIONS_API_FUNCTIONS.SET, item)
    }
  }

  handleRemove(func: ApiFunction) {
    const index = this.allFunctions.findIndex(e => e.uuid == func.uuid)
    console.log(this.allFunctions.map(e => e.uuid))
    console.log(func.uuid)
    if (index != -1) {
      this.allFunctions.splice(index, 1)
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