<template>
  <el-container id="app">
    <el-header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="/">BLoC</el-menu-item>
        <el-menu-item index="/Model">Models</el-menu-item>
      </el-menu>
    </el-header>
    <el-main v-loading="isLoading">
      <router-view/>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {ACTIONS} from "@/store";

@Component({})
export default class App extends Vue {
  activeIndex = '/'
  isLoading = true;

  handleSelect(key: string, keyPath: string) {
    this.$router.push(key);
  }

  async mounted() {
    this.activeIndex = this.$route.path;

    await this.$store.dispatch(ACTIONS.RESTORE);

    this.isLoading = false;
  }
}
</script>


<style>
</style>
