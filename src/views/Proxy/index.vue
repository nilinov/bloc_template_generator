<template>
  <div class="Proxy">
    <TextBox v-model="fileName" placeholder="Имя файла"/>
    <TextBox v-model="krakenApiPrefix" placeholder="/api"/>
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
  host = '';

  mounted() {
    this.fileName = localStorage.getItem('Kraken/fileName') ?? ''
    this.krakenApiPrefix = localStorage.getItem('Kraken/krakenApiPrefix') ?? '/api'
    this.host = localStorage.getItem('Kraken/host') ?? 'http://backend-nginx'
  }

  @Watch('fileName')
  handleWatch1() {
    this.updateLocalData();
  }

  @Watch('krakenApiPrefix')
  handleWatch2() {
    this.updateLocalData();
  }

  @Watch('host')
  handleWatch3() {
    this.updateLocalData();
  }

  updateLocalData() {
    localStorage.setItem('Kraken/fileName', this.fileName);
    localStorage.setItem('Kraken/krakenApiPrefix', this.krakenApiPrefix);
    localStorage.setItem('Kraken/host', this.host);
  }

  get result() {
    return krakend(this.fileName, this.krakenApiPrefix, this.host, this.$store.getters.allApiFunctions);
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
