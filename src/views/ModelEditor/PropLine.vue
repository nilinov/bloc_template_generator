<template>
  <div class="ModelEditor" :class="{isEnum}">
    <TextBox class="text-box" placeholder="Name property" v-model="item.name"/>
    <SelectBox v-if="!isEnum" class="select-box" placeholder="Select type" :options="options" v-model="item.type"/>
    <TextBox v-if="!isEnum" class="text-box" placeholder="Default value" v-model="item.defaultValue"
             :disabled="item.nullable"/>
    <input v-if="!isEnum" type="checkbox" v-model="item.nullable">
    <button :disabled="disabled" v-if="action" @click="AddItem">Добавить</button>
    <button v-else @click="$emit('remove')">Удалить</button>
  </div>
</template>

<script>
import {TextBox, SelectBox} from "@/components";

export default {
  name: "ModelEditor",
  props: {
    /** @type PropItem */
    item: {
      type: Object,
      default: () => ({
        name: 'id',
        type: 'int',
        defaultValue: '0',
        nullable: false,
      }),
    },
    allTypes: Array,
    isEnum: Boolean,
    action: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    options() {
      return ['String', 'int', 'double', 'DateTime', 'bool', ...(this.allTypes ?? [])].map(e => ({key: e, value: e}))
    },
    disabled() {
      if (this.isEnum) {
        return !this.item.name
      }
      return !this.item.name || !this.item.type;
    },
  },
  methods: {
    AddItem() {
      if (!this.disabled)
        this.$emit('add')
    },
  },
  data: () => ({}),
  components: {
    SelectBox, TextBox,
  },
}
</script>

<style scoped lang="scss">
.ModelEditor {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: auto auto auto 20px 150px;
  align-items: center;

  &.isEnum {
    grid-template-columns: 1fr 150px;
  }
}
</style>