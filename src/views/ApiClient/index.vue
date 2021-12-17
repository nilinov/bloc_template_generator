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
        <div>
          <el-tag
              v-for="item of tags"
              @click="selectTag !== item ? selectTag = item : selectTag = ''"
              style="margin-right: .5rem; cursor: pointer;"
              :type="item === selectTag ? `success` : ''"
          >
            {{ item }}
          </el-tag>

        </div>
        <br>
        <hr>
        <br>

        <template
            v-for="(item, index) of allFunctions"
            v-if="selectTag !== '' ? item.tag === selectTag : true"
        >
          <FormEdit
              :item="item"
              @remove="handleRemove"
              @update="handleUpdate"
              :key="`form-${item.uuid}`"
          />
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
          <el-tab-pane label="Laravel" name="laravel">
            <template v-if="lang === 'laravel'">
              <LaravelTabContent/>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
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

@Component({
  components: {LaravelTabContent, FormEdit}
})
export default class ApiClient extends Vue {

  lang = 'swagger'
  // lang = 'dart'
  // lang = 'laravel'

  get allFunctions(): ApiFunction[] {
    return this.$store.getters.allApiFunctions ?? [];
  }

  code = '';

  created() {
    if (!this.$store.state.isPending)
      this.updateCode();
  }

  get emptyApiFunction(): ApiFunction {
    return emptyApiFunction();
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

  selectTag = '';

  get tags() {
    const tags = this.allFunctions.map(e => e.tag).filter(e => e);

    const res: {[x: string]: boolean} = {}

    for(const tag of tags) res[tag] = true;

    return Object.keys(res);
  }

  updateCode() {
    console.log(this.allModels)
    if (this.lang == 'dart') {
      this.code = generateCodeApiClient(this.allFunctions, this.allModels);
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