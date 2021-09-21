<template>
  <div class="index">
    <div class="all-models">
      <div class="model" v-for="item of allModels" :class="{active: uuid === item.uuid}" @click="$router.push(`/Model/${item.uuid}`)">{{item.name}}</div>
    </div>
    <div class="content">
      <h4>Edit model {{ name }}
        <button @click="auth">Auth</button>
      </h4>

      <div class="inline">
        <TextBox placeholder="Name class" v-model="name"/>
        <SelectBox :options="[{ key: 'enum', value: 'enum' }]" placeholder="AdditionalInfo" v-model="AdditionalInfo"/>
      </div>

      <PropLine v-for="(item, index) of items" :item="item" :key="`item-${item.name}-${item.type}`"
                @remove="handleRemoveItem(index)"/>
      <PropLine :item="emptyItem" @add="handleAddItem" action/>

      <render-code v-if="!isEnum" :items="items" :name-class="name"/>
      <render-enum-code v-if="isEnum" :items="items" :name-class="name"/>
    </div>
  </div>
</template>

<script lang="ts">
import PropLine from "./PropLine";
import RenderCode from "@/views/ModelEditor/RenderCode";
import TextBox from "@/components/TextBox";
import SelectBox from "@/components/SelectBox";
import {ACTIONS, MUTATIONS} from "@/store";
import Vue from "vue";
import Component from "vue-class-component";
import {Model, PropItem} from "@/views/ModelEditor/RenderCodeLineType";
import RenderEnumCode from "@/views/ModelEditor/RenderEnumCode.vue";

@Component({
  watch: {
    AdditionalInfo(val) {
      this.isEnum = val === 'enum';
    },
    name(val) {
      this.$store.commit(MUTATIONS.SET_MODEL, this.model);
    },
    isEnum(val) {
      this.$store.commit(MUTATIONS.SET_MODEL, this.model);
    },
    items: {
      deep: true,
      handler(val) {
        this.$store.commit(MUTATIONS.SET_MODEL, this.model);
      }
    },
    route() {
      this.restoreFormState(this.$route.params.uuid)
    }
  },
  components: {
    RenderEnumCode,
    SelectBox,
    TextBox,
    RenderCode,
    PropLine,
  },
  mounted() {
    this.$store.commit(MUTATIONS.RESTORE_MODELS);

    this.restoreFormState(this.$route.params.uuid)
  },
})
export default class ModelEditor extends Vue {
  uuid = Math.random();
  name = 'Item';
  AdditionalInfo = '';
  isEnum: boolean = false;

  get model(): Model {
    return {
      uuid: this.uuid,
      name: this.name,
      props: this.items,
      isEnum: this.isEnum,
    }
  }

  get allModels(): Model[] {
    return this.$store.state.models;
  }

  get route() {
    return this.$route.fullPath
  }

  items: PropItem[] = [
    {
      name: 'id',
      type: 'int',
      defaultValue: '0',
      nullable: false,
    },
    {
      name: 'title',
      type: 'String',
      defaultValue: '0',
      nullable: false,
    }
  ];

  emptyItem: PropItem = {
    name: '',
    type: 'String',
    nullable: false,
    defaultValue: '',
  }

  restoreFormState(uuid) {
    const item: Model = this.$store.state.models.find(e => e.uuid == uuid);
    if (item) {
      this.uuid = item.uuid;
      this.name = item.name;
      this.items = item.props;
      this.isEnum = item.isEnum;
      if (this.isEnum) this.AdditionalInfo = 'enum'
    }
  }

  getEmptyItem(): PropItem {
    return {
      name: '',
      type: 'String',
      nullable: false,
      defaultValue: '',
    }
  };

  handleRemoveItem(index = 0) {
    this.items.splice(index, 1)
  };

  handleAddItem() {
    this.items.push({...this.emptyItem});
    this.emptyItem = this.getEmptyItem();
  };

  auth() {
    this.$store.dispatch(ACTIONS.LOGIN)
  };
}

</script>

<style scoped lang="scss">
.index {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 1rem;

  .content {
    display: grid;
    grid-gap: 1rem;


    h4 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0;

      button {
        margin-left: auto;
      }
    }

    .inline {
      input {
        width: 100%;
      }

      select {
        margin-left: 1rem;
        width: 500px;
      }
    }
  }

  .all-models {
    .model {
      border: 2px solid $color-gray-100;
      background-color: $color-gray-100;
      margin-bottom: 1rem;
      padding: 1rem;
      cursor: pointer;

      &.active {
        background-color: #fff;
      }
    }
  }
}

</style>