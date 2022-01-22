<template>
  <div class="Admin">
    <table>
      <tr>
        <th>UUID</th>
        <th>Name</th>
        <th>Version</th>
        <th>Action</th>
      </tr>
      <template v-for="item of allProjects">
        <tr :class="{select: item.uuid == selectProject.uuid}">
          <td class="uuid">{{ item.uuid }}</td>
          <td class="name" :class="{select: item.name == selectProject.name}">{{ item.name }}</td>
          <td class="version">{{ item.version }}</td>
          <td class="action">
            <el-button @click="handleRemove(item)">Remove</el-button>
            <el-button @click="handleClone(item)">Clone</el-button>
            <el-button @click="handleSelect(item)">Select</el-button>
          </td>
        </tr>
      </template>
    </table>

    <el-button class="create" @click="handleCreate">Новый проект</el-button>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {IProject} from '@/views/ApiClient/generate_code_api_client.ts'
import {ACTIONS_PROJECT} from "@/store/project";
import {ACTIONS} from "@/store";

@Component({})
export default class Admin extends Vue {
  get selectProject(): IProject {
    return this.$store?.getters.project ?? {uuid: '0', name: '', version: 1};
  }

  get allProjects(): IProject[] {
    return this.$store.getters.allProjects ?? [];
  }

  mounted() {

  }

  async handleRemove(item: IProject) {
    const res = await this.$confirm('Удалить проект?', '', {
      confirmButtonText: "Продолжить",
      cancelButtonText: "Отмена"
    })
    try {
      await this.$store.dispatch(ACTIONS_PROJECT.REMOVE, item.uuid)
      await this.$notify({message: 'Проект успешно удален', title: ''})
    } catch (e) {
      await this.$notify({message: 'Не удалось удалить проект', title: '', type: "error"})
    }
  }

  async handleSelect(item: IProject) {
    try {
      console.log({item})
      await this.$store.dispatch(ACTIONS.SET_PROJECT, item.uuid);
      await this.$notify({message: 'Проект успешно загружен', title: ''})
    } catch (e) {
      await this.$notify({message: 'Не удалось загрузить проект', title: '', type: "error"})
    }
  }

  async handleClone(item: IProject) {
    const projectByName =this.allProjects.filter(e => e.name == item.name)
    projectByName.sort((e1, e2) => e1.version > e2.version ? 1 : -1);
    const lastVersion = Number((projectByName.pop()?.version ?? '1')) + 1;

    const res = await this.$prompt(`Какая версия проекта ${item.name}?`, '', {
      inputValue: `${lastVersion}`,
      confirmButtonText: "Продолжить",
      cancelButtonText: "Отмена"
    })
    try {
      await this.$store.dispatch(ACTIONS.CLONE_PROJECT, {uuid: item.uuid, version: (res as any).value})
      await this.$notify({message: 'Проект успешно создан', title: ''})
    } catch (e) {
      await this.$notify({message: 'Не удалось создать проект', title: '', type: "error"})
    }
  }

  async handleCreate() {
    const res = await this.$prompt('Как назвать новый проект?', '', {
      confirmButtonText: "Продолжить",
      cancelButtonText: "Отмена"
    })
    const uuid = Number([...this.allProjects].pop()?.uuid) + 1;
    const payload: IProject = {
      uuid: `${uuid}`,
      version: 1,
      name: (res as any)?.value ?? '',
    }
    try {
      await this.$store.dispatch(ACTIONS_PROJECT.SET, payload)
      await this.$notify({message: 'Проект успешно создан', title: ''})
    } catch (e) {
      await this.$notify({message: 'Не удалось создать проект', title: '', type: "error"})
    }
  }
}
</script>

<style scoped lang="scss">
.Admin {
  table {
    width: 25%;
    min-width: 600px;

    th, td {
      border: 1px solid;
      padding: 2px 5px;
    }

    th {
    }

    td.uuid, td.version {
      text-align: center;
    }

    td.name {
      width: 100%;
    }

    td.action {
      display: flex;
    }

    .select {
      background-color: #9ef1cb;
    }
  }

  .create {
    margin-top: 1rem;
  }
}
</style>