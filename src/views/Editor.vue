<template>
  <div class="generate-screen">
    <div class="props">
      <TextBox class="text-box" placeholder="Name bloc" v-model="nameBloc" @input="updateCode"/>
      <TextBox class="text-box" placeholder="Name class entity" v-model="nameClassEntity" @input="updateCode"/>
      <div class="space"></div>
      <SelectBox class="select-box"/>
    </div>
    <div class="areas">
      <div class="area-event">
        <p class="area-title">Bloc</p>
        <pre class="code" v-text="code.bloc"></pre>
      </div>
      <div class="area-event">
        <p class="area-title">State</p>
        <pre class="code" v-text="code.state"></pre>
      </div>
      <div class="area-event">
        <p class="area-title">Events</p>
        <pre class="code" v-text="code.event"></pre>
      </div>
    </div>
  </div>
</template>

<script>
import {TextBox, SelectBox} from "@/components";
import stateDefaultTemplate from "@/utils/state.default.template";
import {sampleLoadList} from "@/utils/sample.load.list";
import {blocDefaultTemplate} from "@/utils/bloc.default.tempalte";
import {eventTemplate} from "@/utils/event.template";

export default {
  name: "GenerateScreen",
  components: {TextBox, SelectBox},
  props: {
  },
  data: () => ({
    nameBloc: 'Coupon',
    nameClassEntity: 'Coupon',
    code: {
      bloc: '',
      state: '',
      event: '',
    }
  }),
  mounted() {
    this.updateCode();
  },
  methods: {
    updateCode() {
      this.code.bloc = blocDefaultTemplate(sampleLoadList(this.nameBloc, this.nameClassEntity))
      this.code.state = stateDefaultTemplate(sampleLoadList(this.nameBloc, this.nameClassEntity))
      this.code.event = eventTemplate(sampleLoadList(this.nameBloc, this.nameClassEntity))
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style";

.generate-screen {
  background-color: $color-white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.props {
  margin-bottom: 10px;
  padding: 0 0 15px;
  display: flex;
  align-items: flex-start;
  align-self: stretch;
}

.text-box {
  margin-right: 10px;
  width: 176px;
}

.space {
  height: 1px;
  margin-right: 10px;
  flex: 1;
}

.select-box {
  width: 197px;
}

.areas {
  display: flex;
  align-items: flex-start;
  align-self: stretch;
}

.area-event {
  padding: 9px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  border: 1px solid $transparent-black;

  &:not(:last-of-type) {
    margin-right: 10px;
  }

  width: 33%;
  max-width: 33%;
}

.area-title {
  color: $color-gray-900;
  align-self: stretch;
  margin-bottom: 10px;
  @include roboto-18-bold;
}

.code {
  color: $color-gray-900;
  align-self: stretch;
  @include roboto-12-regular;

  overflow: auto;
}
</style>