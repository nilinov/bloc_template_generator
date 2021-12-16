<template>
  <div>
    <el-tabs v-model="laravelTab">
      <el-tab-pane label="api.php" name="api.php">
        <span class="fileName">api.php</span>
        <pre class="codeForSave" v-text="code"></pre>
      </el-tab-pane>

      <el-tab-pane v-for="item of allTags" :label="`${getNameController(item)}`" :name="`${item.tag}`">
        <span class="fileName">{{ getNameController(item) }}.php</span>
        <pre class="codeForSave" v-text="code"></pre>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";
import {generateLaravelApi} from "@/views/ApiClient/generate_laravel_api";
import {Model} from "@/views/ModelEditor/RenderCodeLineType";

function getNameController(func: ApiFunction) {
  return `${func.tag}Controller`
}

@Component({
  components: {}
})
export default class LaravelTab extends Vue {
  laravelTab = 'api.php';

  getNameController = getNameController;

  get allFunctions(): ApiFunction[] {
    return this.$store.getters.allApiFunctions ?? [];
  }

  get allModels(): Model[] {
    return this.$store.state.models;
  }

  get allTags(): ApiFunction[] {
    const res: {[x: string]: ApiFunction} = {};
    for(const item of this.allFunctions) {
      res[item.tag] = item;
    }
    return Object.values(res);
  }

  get allControllers() {
    const res: {[x: string]: ApiFunction} = {};
    for(const item of this.allFunctions) {
      res[item.tag] = item;
    }
    return Object.values(res).map(e => getNameController(e));
  }

  get selectedApiFunc() {
    return this.allFunctions.filter(e => e.tag == this.laravelTab);
  }

  get code() {
    if (this.laravelTab == 'api.php') {
      return generateLaravelApi(this.allModels, this.allFunctions);
    } else {
      return this.laravelTab
    }
  }
}


</script>

<style scoped>

</style>