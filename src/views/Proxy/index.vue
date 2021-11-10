<template>
  <div class="Proxy">
    <TextBox v-model="fileName" placeholder="Имя файла"/>
    <TextBox v-model="krakenForeignApiPrefix" placeholder="krakenForeignApiPrefix"/>
    <TextBox v-model="krakenApiPrefix" placeholder="/api"/>
    <TextBox v-model="roles" placeholder="roles"/>
    <TextBox v-model="host" placeholder="http://backend-nginx"/>
    <div class="code" v-if="result">
      <span class="fileName">{{ fileName }}.tmpl</span>
      <pre class="codeForSave" v-text="result"></pre>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import TextBox from "@/components/TextBox.vue";
import {krakend} from "@/views/Proxy/krakend";

@Component({
  components: {TextBox}
})
export default class Proxy extends Vue {
  fileName = '';
  krakenApiPrefix = '/api';
  krakenForeignApiPrefix = '';
  host = '';
  roles = '"user"'

  mounted() {
    this.fileName = localStorage.getItem('Kraken/fileName') ?? ''
    this.krakenForeignApiPrefix = localStorage.getItem('Kraken/krakenForeignApiPrefix') ?? ''
    this.krakenApiPrefix = localStorage.getItem('Kraken/krakenApiPrefix') ?? '/api'
    this.host = localStorage.getItem('Kraken/host') ?? 'http://backend-nginx'
    this.roles = localStorage.getItem('Kraken/roles') ?? '"user"'
  }

  @Watch('fileName')
  handleWatch1() {
    this.updateLocalData();
  }

  @Watch('krakenApiPrefix')
  handleWatch2() {
    this.updateLocalData();
  }

  @Watch('krakenForeignApiPrefix')
  handleWatch4() {
    this.updateLocalData();
  }

  @Watch('host')
  handleWatch3() {
    this.updateLocalData();
  }

  @Watch('roles')
  handleWatch5() {
    this.updateLocalData();
  }

  updateLocalData() {
    localStorage.setItem('Kraken/fileName', this.fileName);
    localStorage.setItem('Kraken/krakenApiPrefix', this.krakenApiPrefix);
    localStorage.setItem('Kraken/krakenForeignApiPrefix', this.krakenForeignApiPrefix);
    localStorage.setItem('Kraken/host', this.host);
    localStorage.setItem('Kraken/roles', this.roles);
  }

  get result() {
    return krakend(this.fileName, this.krakenApiPrefix, this.host, this.$store.getters.allApiFunctions, {krakenForeignApiPrefix: this.krakenForeignApiPrefix, roles: this.roles});
  }
}
</script>

<style scoped lang="scss">
.Proxy {
  .code {
    margin-top: 1rem;
  }
}
</style>
