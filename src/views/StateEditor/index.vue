<template>
  <div class="StateEditorIndex">

    <el-tabs v-model="tag">
      <template v-for="item of allTags">
        <el-tab-pane :label="item" :name="item" :key="`tag-${item}`">
        </el-tab-pane>
      </template>
    </el-tabs>


    <el-tabs v-model="typeModule" v-if="allApiFunctionsTag.length">
      <el-tab-pane label="List" name="list">

      </el-tab-pane>
      <el-tab-pane label="Entity" name="entity">

      </el-tab-pane>
      <el-tab-pane label="Custom" name="custom">

      </el-tab-pane>
    </el-tabs>


    <div class="props"  v-if="allApiFunctionsTag.length">
      <text-box class="text-box" placeholder="Name bloc" v-model="nameBloc"/>
      <el-autocomplete
          class="inline-input text-box"
          v-model="typeLabel"
          :fetch-suggestions="querySearchModel"
          placeholder="Модель данных"
          @select="handleSelectModel"
      ></el-autocomplete>
      <el-select v-model="apiFunctionUUID" placeholder="Api Request" clearable>
        <el-option
            v-for="item in allApiFunctionsTag"
            :key="item.uuid"
            :label="item.name"
            :value="item.uuid">
        </el-option>
      </el-select>

      <div class="space"></div>

      <el-select v-model="codeLang">
        <el-option value="dart">dart</el-option>
        <el-option value="typescript">typescript</el-option>
      </el-select>
    </div>

    <state-editor-ts
        :api-function-uuid="apiFunctionUUID"
        :name-bloc="nameBloc"
        :type-label="typeLabel"
        :type-module="typeModule"
    />
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import StateEditor from "@/views/StateEditor/StateEditor.vue";
import StateEditorTs, {TypeModule} from "@/views/StateEditor/StateEditorTs.vue";
import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";
import TextBox from "@/components/TextBox.vue";
import {snakeCase} from "lodash";
import {getClassName} from "@/views/ModelEditor/LaravelSeederFactory.vue";
import {fuzzy} from "@/main";

@Component({
  components: {TextBox, StateEditorTs, StateEditor}
})
export default class StateEditorIndex extends Vue {
  codeLang = 'typescript'
  tag = '';

  nameBloc = 'Coupon';

  apiFunctionUUID = '';
  typeLabel = 'Coupon'

  typeModule = TypeModule.list;

  get fileNameBloc() {
    return `${snakeCase(this.nameBloc)}_cubit.dart`
  }

  get fileNameState() {
    return `${snakeCase(this.nameBloc)}_state.dart`
  }

  get apiFunction() {
    return this.allApiFunctions.find(e => e.uuid == this.apiFunctionUUID);
  }

  get allApiFunctions(): ApiFunction[] {
    return (this.$store.getters.allApiFunctions ?? [] as ApiFunction[])
  }

  get allApiFunctionsTag(): ApiFunction[] {
    return this.allApiFunctions.filter(e => e.tag == this.tag)
  }

  get fileName() {
    return getClassName(`${this.nameBloc}_module`) + '.ts'
  }

  get allTags() {
    const res: { [x: string]: boolean } = {}
    for (let item of this.$store.getters.allApiFunctions as ApiFunction[]) {
      res[item?.tag ?? 'default'] = true;
    }
    return Object.keys(res);
  }

  @Watch('allTags')
  handleChange1() {
    this.tag = this.allTags[0];
  }

  mounted() {
    this.tag = this.allTags[0];
  }

  querySearchModel(queryString: string, cb: Function) {
    console.log(queryString)
    const models: string[] = this.$store.getters.allModels;
    var results = queryString ? models.filter(model => fuzzy(model.toLowerCase(), queryString.toLowerCase())) : models;

    cb(results.map(model => ({value: model, item: model})));
  }

  handleSelectModel(item: { value: string, item: string }) {
    console.log('handleSelectModel')
    this.typeLabel = item.item;
  }

}
</script>

<style scoped lang="scss">

.props {
  margin-bottom: 10px;
  padding: 0 0 15px;
  display: flex;
  align-items: flex-start;
  align-self: stretch;


  .text-box {
    margin-right: 10px;
    width: 176px;
  }

  .space {
    height: 1px;
    margin-right: 10px;
    flex: 1;
  }

  .select-box {
    width: 197px;
    margin-right: 10px;
  }
}
</style>
