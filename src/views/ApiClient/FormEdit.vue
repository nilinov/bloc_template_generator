<template>
  <div class="FormEdit" :key="`form-item-${localItem.uuid}`">
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
    <el-input v-model="localItem.path" placeholder="Путь запроса"></el-input>
    <el-autocomplete
        class="inline-input"
        v-model="labelSelectModel"
        :fetch-suggestions="querySearchModel"
        placeholder="Модель данных"
        @select="handleSelectModel"
    ></el-autocomplete>

    <el-checkbox v-model="localItem.isMock">Моки</el-checkbox>
    <el-checkbox v-model="localItem.isList">Список</el-checkbox>
    <el-checkbox v-model="localItem.hasPaginate" v-if="localItem.isList">Есть пагинация</el-checkbox>
    <el-checkbox v-model="localItem.hasSearch" v-if="localItem.isList">Есть поиск</el-checkbox>
    <el-checkbox v-model="localItem.hasFilter" v-if="localItem.isList">Есть фильтры</el-checkbox>

    <div v-for="(item, index) of localItem.params" class="form-variable"
         :key="`variable-${localItem.uuid}-${item.name}`">
      <el-select v-model="item.place" placeholder="Способ">
        <el-option v-for="item in optionsPlaceVariable" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-select v-model="item.type" placeholder="Тип">
        <el-option v-for="item in optionsTypeVariable" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-input v-model="item.name" placeholder="Имя переменной"></el-input>
      <div @click="handleRemoveVariable(index)">
        <el-icon name="minus"></el-icon>
      </div>
    </div>
    <div class="form-variable">
      <el-select v-model="localVariable.place" placeholder="Способ">
        <el-option v-for="item in optionsPlaceVariable" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-select v-model="localVariable.type" placeholder="Тип">
        <el-option v-for="item in optionsTypeVariable" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-input v-model="localVariable.name" placeholder="Имя переменной"></el-input>
      <div @click="handleAddVariable">
        <el-icon name="plus"></el-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Watch, Emit} from "vue-property-decorator";
import {Model} from "@/views/ModelEditor/RenderCodeLineType";

export interface ApiFunctionParam {
  place: 'in-path' | 'query' | 'body',
  name: string
  type: 'int' | 'String' | 'bool'
}

export interface ApiFunction {
  uuid: string
  name: string
  path: string
  method: 'GET' | 'POST'
  modelUUID: string
  isList: boolean
  isMock: boolean
  hasPaginate: boolean
  hasSearch: boolean
  hasFilter: boolean
  params: ApiFunctionParam[]
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
    path: '/',
    name: '',
    method: 'GET',
    modelUUID: '',
    isList: false,
    isMock: true,
    hasFilter: false,
    hasPaginate: false,
    hasSearch: false,
    params: [],
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

  optionsPlaceVariable = ['in-path', 'query', 'body'];
  optionsTypeVariable = ['int', 'String', 'bool'];

  localVariable: ApiFunctionParam = {
    name: '',
    type: 'int',
    place: 'query'
  }

  isMounted = false;

  created() {
    this.updateFromProps();
  }

  mounted() {
    this.isMounted = true;
  }

  @Watch('item')
  handleChange1(val: ApiFunction) {
    if (this.isMounted)
      this.updateFromProps();
  }

  updateFromProps() {
    this.localItem.uuid = this.item.uuid;
    this.localItem.name = this.item.name;
    this.localItem.path = this.item.path;
    this.localItem.method = this.item.method;
    this.localItem.isList = this.item.isList;
    this.localItem.hasPaginate = this.item.hasPaginate;
    this.localItem.hasSearch = this.item.hasSearch;
    this.localItem.hasFilter = this.item.hasFilter;
    this.localItem.params = this.item.params;

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
    // if (this.isMounted)
    //   this.sendUpdate();
  }

  handleAddVariable() {
    console.log('handleAddVariable')
    this.localItem.params.push({...this.localVariable})
    this.localVariable = this.emptyVariable;
  }

  handleRemoveVariable(index: number) {
    console.log('handleRemoveVariable')
    this.localItem.params.splice(index, 1)
  }

  get emptyVariable(): ApiFunctionParam {
    return {
      name: '',
      place: 'in-path',
      type: 'int'
    }
  }

  @Emit('update')
  sendUpdate() {
    console.log('send update', {...this.localItem})
    return {...this.localItem};
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

  .form-variable {
    display: grid;
    grid-template-columns: 1fr 1fr 3fr auto;
    grid-gap: 1rem;
    align-items: center;
  }
}
</style>