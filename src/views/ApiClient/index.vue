<template>
  <div>
    <el-autocomplete
        class="inline-input"
        v-model="state1"
        :fetch-suggestions="querySearch"
        placeholder="Please Input"
        @select="handleSelect"
    ></el-autocomplete>

    <pre>



    </pre>

  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import {Model} from "@/views/ModelEditor/RenderCodeLineType";

@Component({})
export default class ApiClient extends Vue {
  models: Model[] = [];
  state1 = '';
  selectModel?: Model;

  querySearch(queryString: string, cb: Function) {
    var model = this.models;
    var results = queryString ? model.filter(this.handleFilter(queryString)) : model;

    cb(results.map(model => ({value: model.name, item: model})));
  }

  handleFilter(queryString: string) {
    return (model: Model) => {
      return (model.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    };
  }

  get allModels() {
    return this.$store.state.models;
  }

  @Watch('allModels')
  onChildChanged(val: string, oldVal: string) {
    this.models = this.$store.state.models;
  }

  handleSelect(item: { value: string, item: Model }) {
    this.selectModel = item.item;
  }

}
</script>

<style scoped>

</style>