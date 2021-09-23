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
        <template v-for="item of allFunctions">
          <FormEdit :item="item" @remove="handleRemove"/>
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
import FormEdit, {ApiFunction} from "@/views/ApiClient/FormEdit.vue";

function getParamsApiFunction(e: ApiFunction) {
  const res: string[] = [];

  if (e.isList) {
    if (e.hasSearch) res.push('String? search,')
    if (e.hasPaginate) res.push('int page = 1,')
    if (e.hasFilter) res.push('Map<String, dynamic>? filters,')
  }

  return res.length ? `{${res.join('')}}` : ''
}

@Component({
  components: {FormEdit}
})
export default class ApiClient extends Vue {

  allFunctions: ApiFunction[] = [];

  mounted() {
    this.allFunctions.push({
      name: 'getListActive',
      modelUUID: '0.492427911996681',
      method: 'GET',
      uuid: '1',
      isList: true,
      hasSearch: true,
      hasPaginate: true,
      hasFilter: true,
    });
  }

  get emptyApiFunction(): ApiFunction {
    return {
      uuid: Math.random().toString(),
      name: '',
      method: 'GET',
      modelUUID: '',
      isList: false,
      hasFilter: false,
      hasPaginate: false,
      hasSearch: false,
    }
  }

  get allModels(): Model[] {return this.$store.state.models; }

  get code() {
    return `import 'package:mad_teams/_imports.dart';
class Api {
  ${this.allFunctions.map(e => {
    const model = this.allModels.find(e1 => e1.uuid == e.modelUUID);
    if (model && e.isList)
      return `static Future<ApiResponse<List<${model.name}>>> getListActive(${getParamsApiFunction(e)}) {
        final Map<String, dynamic> params = {};

        ${e.hasPaginate ? 'params[\'page\'] = page;\n' : ''}
        ${e.hasSearch ? 'if (search != null) { params[\'search\'] = search; }\n' : ''}
        ${e.hasFilter ? 'if (filters != null) { params.addAll(params); }\n' : ''}

        return ApiClient.dio
            .get('/', queryParameters: params)
            .then((value) => ApiResponse(
                  ${model.name}.listFromJson(value.data['data']),
                  meta: MetaPage.fromJson(value.data['meta']),
                ))
            .catchError((error) => ApiResponse(<${model.name}>[], error: error));
      }`;
    })}
}
`
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