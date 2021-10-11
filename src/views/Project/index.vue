<template>
  <div class="dropArea" ref="dropArea">
    <div class="Project">
      <el-select v-model="project_uuid" placeholder="Проект" @input="handleSelect">
        <el-option
            v-for="item in allProjects"
            :key="item.uuid"
            :label="`${item.name} / v${item.version}`"
            :value="item.uuid">
        </el-option>
      </el-select>

      <el-input v-model="project_name" @change="handleRename"/>

      <el-button @click="handleExport">Экспорт проекта</el-button>
      <el-button @click="handleImport">Импорт проекта</el-button>

      <input type="file" id="files" ref="files" @change="handleFileSelect"/>
    </div>
    <div :style="{opacity: message ? 1 : 0}" class="message"> {{message}}</div>

  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {ACTIONS} from "@/store";
import {ACTIONS_PROJECT} from "@/store/project";
import {downloadURI} from "@/main";
import {ACTIONS_API_FUNCTIONS} from "@/store/api_functions";
import {parseSwagger} from "@/views/Project/parse_swagger";

@Component({})
export default class Project extends Vue {

  project_uuid?: string = '';
  project_name?: string = '';
  message = '';

  mounted() {
    this.reset();

    // @ts-ignore
    this.$refs.dropArea.addEventListener('dragover', this.handleDragOver, false);
    // @ts-ignore
    this.$refs.dropArea.addEventListener('drop', this.handleFileSelect, false);

  }

  reset() {
    this.project_uuid = this.$store.getters.project?.uuid;
    this.project_name = this.$store.getters.project?.name;
  }

  get allProjects() {
    return this.$store.getters.allProjects ?? [];
  }

  async handleSelect(uuid: string) {
    await this.$store.dispatch(ACTIONS.SET_PROJECT, uuid);
    this.reset();
  }

  handleRename(name: string) {
    this.$store.dispatch(ACTIONS_PROJECT.SET, {...this.$store.getters.project, name})
  }

  handleExport() {
    downloadURI(`${this.project_name}.json`, JSON.stringify({
      api_functions: this.$store.getters.allApiFunctions,
      models: this.$store.state.models,
      desc: this.$store.getters.project
    }, null, 2))
  }

  handleImport() {
    // @ts-ignore
    this.$refs.files.click()
  }

  handleFileSelect(evt: any) {
    evt.stopPropagation();
    evt.preventDefault();

    console.log('handleFileSelect')
    const files = evt.target.files ?? evt.dataTransfer.files; // FileList object.
    const f = files[0];
    if (f.type == "application/json" || f.type == '') {
      const reader = new FileReader();
      const _this = this;
      reader.onload = (function (theFile: any) {
        return function (e: any) {
          const text = e.target.result
          try {
            _this.importProject(JSON.parse(text))
          } catch (e) {
            _this.importSwagger(text)
          }
        }
      })(f);
      reader.readAsText(f);
    }
  }

  async importProject(json: any) {
    if (json.openapi || json.swagger) {
      this.importSwagger(JSON.stringify(json))
      return;
    }

    this.message = 'Проект сохраняется'

    await this.$store.dispatch(ACTIONS.SET_MODELS, json.models);
    await this.$store.dispatch(ACTIONS_API_FUNCTIONS.SET_ALL, json.api_functions);

    this.message = 'Проект сохранен'
    setTimeout(() => this.message = '', 3600)
  }

  async importSwagger(text: string) {
    const res = await parseSwagger(text);

    await this.$store.dispatch(ACTIONS.SET_MODELS, res.models);
  }

  handleDragOver(evt: any) {
    console.log('handleDragOver')
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }


}
</script>

<style scoped lang="scss">
.dropArea {
  min-height: 80vh;

  .message {
    padding: 1rem;
    border: 1px solid grey;
    margin-top: 2rem;
    transition: opacity 0.3s;
  }

  .Project {
    display: grid;
    grid-template-columns: 300px auto 300px 300px;
    grid-gap: 1rem;

    align-items: start;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }

    #files {
      display: none;
    }
  }
}
</style>
