<template>
  <div class="FormEdit">
    <div class="line-wrap">
      <el-select v-model="localItem.method" placeholder="Метод">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button size="small" @click="$emit('remove', localItem)">Удалить</el-button>
    </div>

    <el-input v-model="localItem.name" placeholder="Имя функции"></el-input>
    <el-autocomplete
        class="inline-input"
        v-model="labelSelectModel"
        :fetch-suggestions="querySearchModel"
        placeholder="Модель данных"
        @select="handleSelectModel"
    ></el-autocomplete>

    <el-checkbox v-model="localItem.isList">Список</el-checkbox>
    <el-checkbox v-model="localItem.hasPaginate" v-if="localItem.isList">Есть пагинация</el-checkbox>
    <el-checkbox v-model="localItem.hasSearch" v-if="localItem.isList">Есть поиск</el-checkbox>
    <el-checkbox v-model="localItem.hasFilter" v-if="localItem.isList">Есть фильтры</el-checkbox>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Watch, Emit} from "vue-property-decorator";
import {Model} from "@/views/ModelEditor/RenderCodeLineType";

export interface ApiFunction {
  uuid: string
  name: string
  method: 'GET' | 'POST'
  modelUUID: string
  isList: boolean
  hasPaginate: boolean
  hasSearch: boolean
  hasFilter: boolean
}

@Component({
  props: {
    item: Object,
  }
})
export default class FormEdit extends Vue {
  item!: ApiFunction

  localItem: ApiFunction = {
    uuid: Math.random().toString(),
    name: '',
    method: 'GET',
    modelUUID: '',
    isList: false,
    hasFilter: false,
    hasPaginate: false,
    hasSearch: false,
  }

  models: Model[] = [];
  labelSelectModel = '';
  selectModel?: Model;

  options = [{
    value: 'GET',
    label: 'GET',
  }, {
    value: 'POST',
    label: 'POST',
  }];

  created() {
    this.updateFromProps();
  }

  @Watch('item')
  handleChange1(val: ApiFunction) {
    this.updateFromProps();
  }

  updateFromProps() {
    this.localItem.uuid = this.item.uuid;
    this.localItem.name = this.item.name;
    this.localItem.method = this.item.method;
    this.localItem.isList = this.item.isList;
    this.localItem.hasPaginate = this.item.hasPaginate;
    this.localItem.hasSearch = this.item.hasSearch;
    this.localItem.hasFilter = this.item.hasFilter;

    this.selectModel = this.allModels.find(e => e.uuid == this.item.modelUUID)
    this.labelSelectModel = this.selectModel?.name ?? '';
  }

  querySearchModel(queryString: string, cb: Function) {
    console.log(queryString)
    const models: Model[] = this.$store.state.models;
    var results = queryString ? models.filter(this.handleFilterModel(queryString)) : models;

    cb(results.map(model => ({value: model.name, item: model})));
  }

  handleFilterModel(queryString: string) {
    return (model: Model) => {
      return (model.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    };
  }

  get allModels(): Model[] {
    return this.$store.state.models;
  }

  @Watch('allModels')
  onChildChanged(val: string, oldVal: string) {
    this.models = this.$store.state.models;
  }

  @Watch('localItem', {deep: true})
  onChildChanged1(val: string, oldVal: string) {
    this.sendUpdate();
  }

  @Emit('update')
  sendUpdate() {
    console.log('sdfsdf')
  }

  handleSelectModel(item: { value: string, item: Model }) {
    this.selectModel = item.item;
  }
}
</script>

<style scoped lang="scss">
.FormEdit {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  justify-content: stretch;

  .line-wrap {
    display: flex;
    justify-content: space-between;

    .el-select {
      width: 100%;
    }

    .el-button {
      width: 150px;
      margin-left: 10px;
    }
  }
}
</style>