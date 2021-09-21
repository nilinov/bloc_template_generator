<template>
  <div class="index">
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

    <render-code :items="items" :name-class="name"/>
  </div>
</template>

<script lang="ts">
import PropLine from "./PropLine";
import RenderCode from "@/views/ModelEditor/RenderCode";
import TextBox from "@/components/TextBox";
import SelectBox from "@/components/SelectBox";
import {ACTIONS} from "@/store";
import Vue from "vue";
import Component from "vue-class-component";
import {PropItem} from "@/views/ModelEditor/RenderCodeLineType";

@Component({
  watch: {
    AdditionalInfo(val) {
      this.isEnum = val === 'enum';
    }
  },
  components: {
    SelectBox,
    TextBox,
    RenderCode,
    PropLine,
  }
})
export default class ModelEditor extends Vue {
  name = 'Item';
  AdditionalInfo = '';
  isEnum: boolean = false;

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
  grid-gap: 1rem;

  h4 {
    display: flex;
    justify-content: space-between;
    align-items: center;

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

</style>