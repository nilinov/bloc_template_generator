<template>
  <div class="index">
    <h4>Edit model {{ name }}</h4>

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

<script>
import PropLine from "./PropLine";
import RenderCode from "@/views/ModelEditor/RenderCode";
import TextBox from "@/components/TextBox";
import SelectBox from "@/components/SelectBox";

export default {
  name: "index",
  data: () => ({
    name: 'Item',
    AdditionalInfo: '',
    isEnum: false,

    /** @type PropItem[] */
    items: [
      {
        name: 'id',
        type: 'int',
        defaultValue: '0',
        nullable: false,
      }
    ],
    /** @type PropItem */
    emptyItem: {
      name: '',
      type: 'String',
      nullable: false,
      defaultValue: '',
    }
  }),
  watch: {
    AdditionalInfo(val) {
      this.isEnum = val === 'enum';
    }
  },
  methods: {
    /** @returns PropItem */
    getEmptyItem: () => ({
      name: '',
      type: 'String',
      nullable: false,
      defaultValue: '',
    }),
    handleRemoveItem(index = 0) {
      this.items.splice(index, 1)
    },
    handleAddItem() {
      this.items.push({...this.emptyItem});
      this.emptyItem = this.getEmptyItem();
    },
  },
  components: {
    SelectBox,
    TextBox,
    RenderCode,
    PropLine,
  }
}
</script>

<style scoped lang="scss">
.index {
  display: grid;
  grid-gap: 1rem;
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

</style>