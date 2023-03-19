<template>
  <el-container id="app">
    <el-header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="/">Models</el-menu-item>
        <el-menu-item index="/ApiClient">Api Client</el-menu-item>
        <el-menu-item index="/ApiExport">Api export</el-menu-item>
        <el-menu-item index="/State">State</el-menu-item>
        <el-menu-item index="/MockEditor">Mock</el-menu-item>
        <el-menu-item index="/Proxy">KrakenD</el-menu-item>
        <el-menu-item index="/Project">Проект</el-menu-item>
        <el-menu-item index="/Admin">Admin</el-menu-item>
      </el-menu>
    </el-header>
    <el-main v-loading="isLoading">
      <router-view v-if="!isLoading"/>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {ACTIONS} from "@/store";

@Component({})
export default class App extends Vue {
  activeIndex = '/'

  get isLoading() {
    return this.$store.state.isPending;
  }

  handleSelect(key: string, keyPath: string) {
    this.$router.push(key);
  }

  async mounted() {
    if (localStorage.getItem('keyValue') == 'JGSADJFHGSD') {
      this.activeIndex = this.$route.path;

      await this.$store.dispatch(ACTIONS.RESTORE);
    } else {
      const key = await this.$prompt('Ключ авторизации', {confirmButtonText: 'Ok', cancelButtonText: 'Cancel'})
      console.log({key})
      localStorage.setItem('keyValue', (key as any).value);
      location.reload()
    }
  }
}
</script>


<style>
</style>
