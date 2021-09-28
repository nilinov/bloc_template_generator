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
          <br><br>
        </template>
        <el-button @click="allFunctions.push(emptyApiFunction)">Добавить</el-button>
      </el-col>
      <el-col :span="16" class="code">
        <span class="fileName">api.dart</span>
        <pre class="codeForSave" v-text="code"></pre>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import {Model} from "@/views/ModelEditor/RenderCodeLineType";
import FormEdit from "@/views/ApiClient/FormEdit.vue";
import {generateCodeApiClient, ApiFunction, ApiFunctionParam} from "@/views/ApiClient/generate_code_api_client";

@Component({
  components: {FormEdit}
})
export default class ApiClient extends Vue {

  allFunctions: ApiFunction[] = [];
  code = '';

  created() {
    this.allFunctions.push({
      name: 'getListActive',
      modelUUID: '0.492427911996681',
      method: 'GET',
      path: '/mock/active',
      uuid: '1',
      isList: true,
      isMock: true,
      hasSearch: false,
      hasPaginate: true,
      hasFilter: false,
      params: [],
    }, {
      name: 'getChallenge',
      modelUUID: '1',
      method: 'GET',
      path: '/challenge/:id',
      uuid: '2',
      isList: false,
      isMock: true,
      hasSearch: false,
      hasPaginate: false,
      hasFilter: false,
      params: [{type: 'int', name: 'id', place: 'in-path'}],
    });
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
    this.code = generateCodeApiClient(this.allFunctions, this.allModels);
  }

  @Watch('allModels')
  handleChange2() {
    this.code = generateCodeApiClient(this.allFunctions, this.allModels);
  }

  handleUpdate(item: ApiFunction) {
    const index = this.allFunctions.findIndex(e => e.uuid == item.uuid);
    if (index != -1) {
      Vue.set(this.allFunctions, index, item)
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