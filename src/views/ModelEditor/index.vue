<template>
  <div class="index">
    <div class="all-models">
      <div class="model" v-for="item of allModels" :class="{active: uuid === item.uuid}"
           @click="$router.push(`/Model/${item.uuid}`)">{{ item.name }}
      </div>
      <div class="model" @click="$router.push(`/Model/Add`)">Добавить</div>
    </div>
    <div class="content" v-if="isOpen">
      <h4>Edit model {{ name }}
<!--        <button @click="auth">Auth</button>-->
        <button @click="handleRemove">Удалить</button>
      </h4>

      <div class="inline">
        <TextBox placeholder="Name class" v-model="name"/>
        <SelectBox :options="[{ key: 'class', value: 'class' }, { key: 'enum', value: 'enum' }]"
                   placeholder="AdditionalInfo" v-model="AdditionalInfo"/>
      </div>

      <PropLine
          v-for="(item, index) of items" :item="item" :key="`item-${item.name}-${item.type}`"
          :is-enum="isEnum"
          :all-types="allModelsNames"
          @remove="handleRemoveItem(index)"
      />
      <PropLine
          :is-enum="isEnum"
          :item="emptyItem" @add="handleAddItem"
          :all-types="allModelsNames"
          action
      />

      <render-code v-if="!isEnum" :items="items" :name-class="name"/>
      <render-enum-code v-if="isEnum" :items="items" :name-class="name"/>
    </div>
    <div v-else>
      Не выбрана модель
    </div>
  </div>
</template>

<script lang="ts">
import PropLine from "./PropLine.vue";
import RenderCode from "@/views/ModelEditor/RenderCode.vue";
import TextBox from "@/components/TextBox.vue";
import SelectBox from "@/components/SelectBox.vue";
import {ACTIONS, MUTATIONS} from "@/store";
import {Component, Vue, Watch} from 'vue-property-decorator';
import {Model, PropItem} from "@/views/ModelEditor/RenderCodeLineType";
import RenderEnumCode from "@/views/ModelEditor/RenderEnumCode.vue";

@Component({
  components: {
    RenderEnumCode,
    SelectBox,
    TextBox,
    RenderCode,
    PropLine,
  },
})
export default class ModelEditor extends Vue {
  uuid = Math.random().toString();
  name = 'Item';
  AdditionalInfo = '';
  isEnum: boolean = false;
  isOpen = true;

  @Watch('AdditionalInfo')
  onChildChanged(val: string, oldVal: string) {
    this.isEnum = val === 'enum';
  }

  @Watch('name')
  onChildChanged2(val: string, oldVal: string) {
    this.$store.commit(MUTATIONS.SET_MODEL, this.model);
  }

  @Watch('isEnum')
  onChildChanged3(val: string, oldVal: string) {
    this.$store.commit(MUTATIONS.SET_MODEL, this.model);
  }

  @Watch('items', {immediate: false, deep: true})
  onChildChanged4(val: any, oldVal: any) {
    this.$store.commit(MUTATIONS.SET_MODEL, this.model);
  }

  @Watch('route', {immediate: false, deep: true})
  onChildChanged5(val: any, oldVal: any) {
    if (this.$route.name == 'ModelEdit') {
      this.restoreFormState(this.$route.params.uuid)
    }
    if (this.$route.name == 'ModelAdd') {
      this.handleOpenAdd()
    }
    if (this.$route.name == 'Model') {
      if (this.allModels.length) {
        this.$router.push({name: 'ModelEdit', params: { uuid: this.allModels[0].uuid }})
      }
    }
  }

  async mounted() {
    if (this.$route.name == 'ModelEdit') {
      this.restoreFormState(this.$route.params.uuid)
    }

    if (this.$route.name == 'ModelAdd') {
      this.handleOpenAdd()
    }

    if (this.$route.name == 'Model') {
      if (this.allModels.length) {
        this.$router.push({name: 'ModelEdit', params: { uuid: this.allModels[0].uuid }})
      }
    }
  }

  handleOpenAdd() {
    this.name = 'Item';
    this.uuid = Math.random().toString();
    this.isEnum = false;
    this.AdditionalInfo = '';

    this.items = [
      {
        name: 'id',
        type: 'int',
        defaultValue: '0',
        nullable: false,
      },
      {
        name: 'title',
        type: 'String',
        defaultValue: '""',
        nullable: false,
      }]
  }

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

  get allModelsNames(): Model[] {
    return this.$store.getters.allModels;
  }

  get route() {
    return this.$route.fullPath
  }

  items: PropItem[] = [];

  emptyItem: PropItem = {
    name: '',
    type: 'String',
    nullable: false,
    defaultValue: '',
  }

  restoreFormState(uuid: string) {
    const item: Model = this.$store.state.models.find((e: Model) => e.uuid == uuid);
    if (item) {
      this.uuid = item.uuid;
      this.name = item.name;
      this.items = item.props;
      this.isEnum = item.isEnum;
      if (this.isEnum) this.AdditionalInfo = 'enum'
      else this.AdditionalInfo = 'class'
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

  handleRemove() {
    this.$store.commit(MUTATIONS.REMOVE_MODEL, this.uuid)
    this.$router.push({name: 'Model'})
  }
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