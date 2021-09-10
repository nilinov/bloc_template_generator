<template>
  <select class="select select-box"  @change="e => $emit('input', e.target.value)" :value="value">
    <option disabled>Выбрать шаблон</option>
    <option v-for="item in options" :value="item.key">{{ item.value }}</option>
  </select>
</template>

<script>
export default {
  name: "SelectBox",
  props: {
    value: { type: String, default: "Template select" },
    options: {
      type: Array,
      default: () => [
      ]
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style";

.select-box {
  border-radius: 40px;
  padding: 9px 14px;
  display: flex;
  align-items: center;
  border: 1px solid $color-gray-100;
}
.select {
  color: $color-gray-600;
  @include roboto-14-regular;

  &:focus-visible {
    border-radius: 40px !important;
    border: 1px solid $color-gray-600 !important;
    outline: none !important;
  }
}
.navigation-arrow-drop-down {
  width: 12px;
  height: 12px;
}
</style>