<template>
  <div class="generate-screen">
    <div class="props">
      <TextBox class="text-box" placeholder="Name bloc" v-model="nameBloc" @input="updateCode"/>
      <TextBox class="text-box" placeholder="Name class entity" v-model="nameClassEntity" @input="updateCode"/>

      <el-select v-model="apiFunctionUUID" placeholder="Api Request" clearable @change="updateApiFunction">
        <el-option
            v-for="item in allApiFunctions"
            :key="item.uuid"
            :label="item.name"
            :value="item.uuid">
        </el-option>
      </el-select>

      <div class="space"></div>
      <SelectBox class="select-box" v-model="typeTemplate" :options="templates" @input="updateCode"/>
      <SelectBox class="select-box" v-model="dataTemplate" :options="templatesData" @input="updateCode"/>
      <slot></slot>
    </div>
    <div class="areas">
      <div class="area-event">
        <div class="area-title">Bloc <span @click="download(fileNameBloc, code.bloc)">Скачать</span></div>
        <pre class="code" v-text="code.bloc"></pre>
      </div>
      <div class="area-event">
        <div class="area-title">State <span @click="download(fileNameState, code.state)">Скачать</span></div>
        <pre class="code" v-text="code.state"></pre>
      </div>
      <div class="area-event" v-if="code.event">
        <p class="area-title">Events</p>
        <pre class="code" v-text="code.event"></pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {TextBox, SelectBox} from "@/components";
import stateDefaultTemplate from "@/utils/templates/bloc-default/state.default.template";
import {sampleLoadList} from "@/utils/sample.load.list";
import {blocDefaultTemplate} from "@/utils/templates/bloc-default/bloc.default.tempalte";
import {eventTemplate} from "@/utils/templates/bloc-default/event.template";
import {blocCubitListTemplate} from "@/utils/templates/cubit-list/bloc.cubit-list.tempalte";
import stateCubitListTemplate from "@/utils/templates/cubit-list/state.cubit-list.template";
import {sampleLoadView} from "@/utils/sample.load.view";

import {Component, Vue} from "vue-property-decorator";
import {ApiFunction} from "@/views/ApiClient/generate_code_api_client";
import {Model} from "@/views/ModelEditor/RenderCodeLineType";
import {UpperFirstLetter} from "@/utils/utils";
import {snakeCase} from "lodash";
import {downloadURI} from "@/main";

@Component({components: {TextBox, SelectBox}})
export default class StateEditor extends Vue {
  nameBloc = 'Coupon';
  isSnackcase = true;
  nameClassEntity = 'Coupon';
  typeTemplate = 'cubit-list';
  dataTemplate = 'sample-view';
  code = {
    bloc: '',
    state: '',
    event: '',
  };
  templates = [
    {
      key: 'bloc',
      value: 'BLoC list',
    },
    {
      key: 'cubit-list',
      value: 'Cubit list'
    },
    {
      key: 'cubit-view',
      value: 'Cubit view',
    }
  ];
  templatesData = [
    {
      key: 'sample-list',
      value: 'Sample list',
    },
    {
      key: 'sample-view',
      value: 'Sample view',
    },
  ];
  user = null;

  apiFunctionUUID = '';

  get fileNameBloc() {
    return `${snakeCase(this.nameBloc)}_cubit.dart`
  }

  get fileNameState() {
    return `${snakeCase(this.nameBloc)}_state.dart`
  }

  get apiFunction() {
    return this.allApiFunctions.find(e => e.uuid == this.apiFunctionUUID);
  }

  get allApiFunctions(): ApiFunction[] {
    return this.$store.getters.allApiFunctions ?? [];
  }

  mounted() {
    this.updateCode();
  };

  updateApiFunction() {
    if (this.apiFunction) {
      const nameClass = (this.$store.getters.allModelsItems as Model[]).find(e => e.uuid == this.apiFunction?.modelUUID);
      this.nameClassEntity = nameClass?.name ?? '';
      this.nameBloc = UpperFirstLetter(this.apiFunction.name.replace('get', '').replace('post', ''));

      this.typeTemplate = 'cubit-list';

      if (this.apiFunction.isList) {
        this.dataTemplate = 'sample-list'
      } else {
        this.dataTemplate = 'sample-view'
      }

      this.updateCode();
    } else {

    }
  }

  download(name: string, text: string) {
    downloadURI(name, text);
  }

  updateCode() {
    const ApiCall = 'Api.' + this.apiFunction?.name ?? 'ApiCall';
    const hasSearch = this.apiFunction?.hasSearch ?? true;
    const hasPaginate = this.apiFunction?.hasPaginate ?? true;
    const hasFilter = this.apiFunction?.hasFilter ?? true;

    let data = sampleLoadList(this.nameBloc, this.nameClassEntity, {ApiCall, hasSearch, hasPaginate, hasFilter, isSnackcase: this.isSnackcase});
    switch (this.dataTemplate) {
      case "sample-list":
        data = sampleLoadList(this.nameBloc, this.nameClassEntity, {ApiCall, hasSearch, hasPaginate, hasFilter, isSnackcase: this.isSnackcase});
        break;
      case "sample-view":
        data = sampleLoadView(this.nameBloc, this.nameClassEntity, {ApiCall, isSnackcase: this.isSnackcase});
        break;
    }

    if (this.typeTemplate === 'bloc') {
      this.code.bloc = blocDefaultTemplate(data)
      this.code.state = stateDefaultTemplate(data)
      this.code.event = eventTemplate(data)
    }

    if (this.typeTemplate === 'cubit-list') {
      this.code.bloc = blocCubitListTemplate(data, {ApiCall, hasSearch, hasPaginate, hasFilter})
      this.code.state = stateCubitListTemplate(data, {ApiCall, hasSearch, hasPaginate, hasFilter})
      this.code.event = '';
    }
  };

};
</script>

<style lang="scss" scoped>
@import "../../assets/style";

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
  margin-right: 10px;
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

  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: 80%;
    font-weight: normal;

    cursor: pointer;
  }
}

.code {
  color: $color-gray-900;
  align-self: stretch;
  @include roboto-12-regular;

  overflow: auto;
}
</style>
