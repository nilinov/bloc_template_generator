<template>
  <div class="ModelEditor" :class="{isEnum}">
    <TextBox class="text-box" placeholder="Name property" v-model="item.name"/>

    <!--    <SelectBox v-if="!isEnum" class="select-box" placeholder="Select type" :options="options" v-model="item.type"/>-->

    <el-autocomplete
        v-if="!isEnum"
        class="inline-input"
        v-model="typeLabel"
        :fetch-suggestions="querySearchModel"
        placeholder="Модель данных"
        @select="handleSelectModel"
    ></el-autocomplete>


    <TextBox v-if="!isEnum" class="text-box" placeholder="Default value" v-model="item.defaultValue"
             :disabled="item.nullable"/>
    <TextBox class="text-box" placeholder="Desc" v-model="item.desc"/>
    <input v-if="!isEnum" type="checkbox" v-model="item.nullable">
    <button :disabled="disabled" v-if="action" @click="AddItem">Добавить</button>
    <button v-else @click="$emit('remove')">Удалить</button>
  </div>
</template>

<script lang="ts">
import {TextBox, SelectBox} from "@/components";
import Component from "vue-class-component";
import {Vue} from "vue-property-decorator";
import {Model, PropItem} from "@/views/ModelEditor/RenderCodeLineType";
import {fuzzy} from "@/main";

@Component({
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
  }, components: {
    SelectBox, TextBox,
  }
})
export default class ModelEditor extends Vue {
  item!: PropItem
  allTypes!: Model[]
  isEnum!: boolean
  action!: boolean

  mounted() {
    this.typeLabel = this.item.type;
  }

  typeLabel = ''

  querySearchModel(queryString: string, cb: Function) {
    console.log(queryString)
    const models: string[] = this.options;
    var results = queryString ? models.filter(model => fuzzy(model.toLowerCase(), queryString.toLowerCase())) : models;

    cb(results.map(model => ({value: model, item: model})));
  }

  handleSelectModel(item: { value: string, item: string }) {
    console.log('handleSelectModel')
    this.typeLabel = item.item;
    this.item.type = item.item;
  }

  get options() {
    return ['String', 'int', 'double', 'DateTime', 'bool', ...this.$store.getters.allModels]
  };

  get disabled() {
    if (this.isEnum) {
      return !this.item.name
    }
    return !this.item.name || !this.item.type;
  };

  AddItem() {
    if (!this.disabled)
      this.$emit('add')
  };
}
</script>

<style scoped lang="scss">
.ModelEditor {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: auto auto auto auto 20px 150px;
  align-items: center;

  &.isEnum {
    grid-template-columns: 1fr auto 150px;
  }
}
</style>