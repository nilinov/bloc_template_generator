<template>
  <div class="generate-screen">
    <div class="props">
      <TextBox class="text-box" placeholder="Name bloc" v-model="nameBloc" @input="updateCode"/>
      <TextBox class="text-box" placeholder="Name class entity" v-model="nameClassEntity" @input="updateCode"/>
      <div class="space"></div>
      <SelectBox class="select-box" v-model="typeTemplate" :options="templates" @input="updateCode"/>
      <SelectBox class="select-box" v-model="dataTemplate" :options="templatesData" @input="updateCode"/>
      <button @click="auth">Auth</button>
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
      <div class="area-event" v-if="code.event">
        <p class="area-title">Events</p>
        <pre class="code" v-text="code.event"></pre>
      </div>
    </div>
  </div>
</template>

<script>
import {TextBox, SelectBox} from "@/components";
import stateDefaultTemplate from "@/utils/templates/bloc-default/state.default.template";
import {sampleLoadList} from "@/utils/sample.load.list";
import {blocDefaultTemplate} from "@/utils/templates/bloc-default/bloc.default.tempalte";
import {eventTemplate} from "@/utils/templates/bloc-default/event.template";
import {blocCubitListTemplate} from "@/utils/templates/cubit-list/bloc.cubit-list.tempalte";
import stateCubitListTemplate from "@/utils/templates/cubit-list/state.cubit-list.template";
import {sampleLoadView} from "@/utils/sample.load.view";

import firebase from "firebase";


export default {
  name: "GenerateScreen",
  components: {TextBox, SelectBox},
  props: {
  },
  data: () => ({
    nameBloc: 'Coupon',
    nameClassEntity: 'Coupon',
    typeTemplate: 'cubit-list',
    dataTemplate: 'sample-view',
    code: {
      bloc: '',
      state: '',
      event: '',
    },
    templates: [
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
    ],
    templatesData: [
      {
        key: 'sample-list',
        value: 'Sample list',
      },
      {
        key: 'sample-view',
        value: 'Sample view',
      },
    ],
  }),
  mounted() {
    this.updateCode();
  },
  methods: {
    updateCode() {
      let data = sampleLoadList(this.nameBloc, this.nameClassEntity);
      switch (this.dataTemplate) {
        case "sample-list":
          data = sampleLoadList(this.nameBloc, this.nameClassEntity);
          break;
        case "sample-view":
          data = sampleLoadView(this.nameBloc, this.nameClassEntity);
          break;
      }

      if (this.typeTemplate === 'bloc') {
        this.code.bloc = blocDefaultTemplate(data)
        this.code.state = stateDefaultTemplate(data)
        this.code.event = eventTemplate(data)
      }

      if (this.typeTemplate === 'cubit-list') {
        this.code.bloc = blocCubitListTemplate(data)
        this.code.state = stateCubitListTemplate(data)
        this.code.event = '';
      }
    },
    auth() {
      var provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth()
          .signInWithPopup(provider)
          .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
          }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });


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