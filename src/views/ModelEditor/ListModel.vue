<template>
  <el-tree
      :data="allModels"
      node-key="id"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      draggable
      :allowDrop="allowDrop"
  >
  </el-tree>

</template>

<script lang="ts">
import {ACTIONS} from "@/store";
import {Component, Vue} from 'vue-property-decorator';
import {Model} from "@/views/ModelEditor/RenderCodeLineType";

@Component({})
export default class ListModel extends Vue {

  codeLang = 'dart'

  get allModels(): Model[] {
    return (this.$store.state.models as Model[]).map((e) => ({...e, label: e.name}));
  }

  created() {

  }

  handleDragStart(node: any, ev: any) {
    //console.log('drag start', node);
  }

  handleDragEnter(draggingNode: any, dropNode: any, ev: any) {
    //console.log('tree drag enter: ', dropNode.label);
  }

  handleDragLeave(draggingNode: any, dropNode: any, ev: any) {
    //console.log('tree drag leave: ', dropNode.label);
  }

  handleDragOver(draggingNode: any, dropNode: any, ev: any) {
    //console.log('tree drag over: ', dropNode.label);
  }

  handleDragEnd(draggingNode: any, dropNode: any, dropType: any, ev: any) {

    const index = this.allModels.findIndex(e => e.name == dropNode.label);
    let items = [...this.allModels.filter(e => e.name !== draggingNode.label)]

    if (dropType == 'before') {
      items.splice(index - 1, 0, draggingNode.data)
    }
    if (dropType == 'after') {
      items.splice(index + 1, 0, draggingNode.data)
    }

    console.log(dropType)
    console.log(draggingNode.label)
    console.log(dropNode.label)
    console.log(index)

    console.log(items.map(e => e.name).join(', '))

    console.log([...items])

    this.$store.dispatch(ACTIONS.SET_MODELS, items);
  }

  handleDrop(draggingNode: any, dropNode: any, dropType: any, ev: any) {
    //console.log('tree drop: ', dropNode.label, dropType);
  }

  allowDrop(draggingNode: any, dropNode: any, type: any) {
    return type !== 'inner'
  }

}
</script>

<style scoped>

</style>