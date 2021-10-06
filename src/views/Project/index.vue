<template>
  <div>
    <el-select v-model="project_uuid" placeholder="Проект" @input="handleSelect">
      <el-option
          v-for="item in allProjects"
          :key="item.uuid"
          :label="item.name"
          :value="item.uuid">
      </el-option>
    </el-select>

    <el-input v-model="project_name" @change="handleRename" />

    <el-button @click="handleExport">Экспорт проекта</el-button>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {ACTIONS} from "@/store";
import {ACTIONS_PROJECT} from "@/store/project";
import {downloadURI} from "@/main";

@Component({})
export default class Project extends Vue {

  project_uuid?: string = '';
  project_name?: string = '';

  mounted() {
    this.reset();
  }

  reset() {
    this.project_uuid = this.$store.getters.project?.uuid;
    this.project_name = this.$store.getters.project?.name;
  }

  get allProjects() {
    return this.$store.getters.allProjects ?? [];
  }

  async handleSelect(uuid) {
    await this.$store.dispatch(ACTIONS.SET_PROJECT, uuid);
    this.reset();
  }

  handleRename(name) {
    this.$store.dispatch(ACTIONS_PROJECT.SET, {...this.$store.getters.project, name})
  }

  handleExport() {
    downloadURI(`${this.project_name}.json`, JSON.stringify({api_functions: this.$store.getters.allApiFunctions, models: this.$store.state.models, desc: this.$store.getters.project }, null, 2))
  }
}
</script>

<style scoped lang="scss">

</style>
