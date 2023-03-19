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

    <el-input v-model="localItem.name" placeholder="Имя функции (например getItems)"></el-input>
    <el-input v-model="localItem.path" placeholder="Путь запроса (/api/v1/model/:id)" @change="updateVariablesPath"></el-input>
    <el-row>
      <el-col :span="12">
        <el-input v-model="localItem.desc" placeholder="Описание функции (текст)"></el-input>
      </el-col>
      <el-col :span="12" class="select-tag-wrap">
        <el-autocomplete
            class="inline-input"
            v-model="localItem.tag"
            :fetch-suggestions="querySearchTag"
            placeholder="Тег"
            @select="handleSelectTag"
            @clear="handleClearTag"
            clearable
        ></el-autocomplete>

      </el-col>
    </el-row>

    <el-autocomplete
        class="inline-input"
        v-model="labelSelectModel"
        :fetch-suggestions="querySearchModel"
        placeholder="Модель данных"
        @select="handleSelectModel"
        @clear="handleClearModel"
        clearable
    ></el-autocomplete>

    <el-checkbox v-model="localItem.isMock">Моки</el-checkbox>
    <el-checkbox v-model="localItem.isList">Список</el-checkbox>
    <el-checkbox v-model="localItem.hasPaginate" v-if="localItem.isList">Есть пагинация</el-checkbox>
    <el-checkbox v-model="localItem.hasSearch" v-if="localItem.isList">Есть поиск</el-checkbox>
    <el-checkbox v-model="localItem.hasFilter" v-if="localItem.isList">Есть фильтры</el-checkbox>

    <div v-for="(item, index) of localItem.params" @input="handleUpdateVariable" class="form-variable">
      <el-select v-model="localItem.params[index].place" placeholder="Способ">
        <el-option v-for="item in optionsPlaceVariable" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-select v-model="localItem.params[index].type" @input="handleUpdateVariable" placeholder="Тип">
        <el-option v-for="item in optionsTypeVariable" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-input v-model="localItem.params[index].name" @input="handleUpdateVariable"
                placeholder="Имя переменной"></el-input>
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
      <el-input v-model="localVariable.name" placeholder="Имя переменной (payload - для главной)"></el-input>
      <div @click="handleAddVariable">
        <el-icon name="plus"></el-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Emit, Vue, Watch} from "vue-property-decorator";
import {Model} from "@/views/ModelEditor/RenderCodeLineType";
import {ApiFunction, ApiFunctionParam} from "@/views/ApiClient/generate_code_api_client";
import {fuzzy} from "@/main";

@Component({
  props: {item: Object},
})
export default class FormEdit extends Vue {
  item!: ApiFunction

  localItem: ApiFunction = {
    uuid: Math.random().toString(),
    path: '',
    name: '',
    desc: '',
    method: 'GET',
    modelUUID: '',
    isList: false,
    isMock: true,
    hasFilter: false,
    hasPaginate: false,
    hasSearch: false,
    params: [],
    tag: '',
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
  }, {
    value: 'PUT',
    label: 'PUT',
  }, {
    value: 'DELETE',
    label: 'DELETE',
  }];

  optionsPlaceVariable = ['in-path', 'query', 'body'];

  get optionsTypeVariable() {
    return ['int', 'bool', 'String', ...this.$store.getters.allModelsClasses];
  }

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
    if (this.isMounted && JSON.stringify(this.localItem) != JSON.stringify(val)) {
      this.updateFromProps();
    }
  }

  updateFromProps() {
    this.localItem.uuid = this.item.uuid;
    this.localItem.modelUUID = this.item.modelUUID;
    this.localItem.name = this.item.name;
    this.localItem.desc = this.item.desc ?? '';
    this.localItem.path = this.item.path;
    this.localItem.method = this.item.method;
    this.localItem.isList = this.item.isList;
    this.localItem.hasPaginate = this.item.hasPaginate;
    this.localItem.hasSearch = this.item.hasSearch;
    this.localItem.hasFilter = this.item.hasFilter;
    this.localItem.params = JSON.parse(JSON.stringify(this.item.params));
    this.localItem.tag = this.item.tag;
    this.localItem.isMock = this.item.isMock;

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
      return (fuzzy(model.name.toLowerCase(), queryString.toLowerCase()));
    };
  }

  querySearchTag(queryString: string, cb: Function) {
    console.log(queryString)
    const tags: string[] = this.$store.getters.tagsApiFunctions;
    var results = queryString ? tags.filter(this.handleFilterTag(queryString)) : tags;

    cb(results.map(tag => ({value: tag, item: tag})));
  }

  handleFilterTag(queryString: string) {
    return (model: string) => {
      return (fuzzy(model.toLowerCase(), queryString.toLowerCase()));
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
  handleChange2(val: string, oldVal: string) {
    if (this.isMounted && JSON.stringify(this.item) != JSON.stringify(val)) {
      this.sendUpdate();
    }
  }

  handleAddVariable() {
    this.localItem.params?.push({...this.localVariable})
    this.updateEmptyValue()
    this.sendUpdate();
  }

  handleUpdateVariable() {
    this.sendUpdate();
  }

  handleRemoveVariable(index: number) {
    this.localItem.params?.splice(index, 1)
    this.sendUpdate();
  }

  updateEmptyValue() {
    this.localVariable.name = this.emptyVariable.name;
    this.localVariable.place = this.emptyVariable.place;
    this.localVariable.type = this.emptyVariable.type;
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
    return JSON.parse(JSON.stringify(this.localItem));
  }

  handleSelectModel(item: { value: string, item: Model }) {
    this.selectModel = item.item;
    this.localItem.modelUUID = item.item.uuid;
  };

  handleClearModel() {
    this.selectModel = undefined;
    this.localItem.modelUUID = '';
  };

  handleSelectTag(item: { value: string, item: string }) {
    this.localItem.tag = item.item;
  };

  handleClearTag() {
    this.localItem.tag = '';
  };

  updateVariablesPath() {
    const variablesRes = this.localItem.params?.filter(e => e.place != 'in-path') ?? [];

    const variables = this.localItem.path.split('/').filter(e => e.includes(':')).map(e => e.replace(':', ''));

    variables.forEach((item) => {
      variablesRes.push({name: item, type: 'int', place: 'in-path'});
    })

    Vue.set(this.localItem, 'params', variablesRes)
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

.el-autocomplete {
  width: 100%;
}

.select-tag-wrap {
  padding-left: 1rem;
}
</style>
