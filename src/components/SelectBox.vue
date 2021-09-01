<template>
  <select class="select select-box">
    <option disabled>Выбрать шаблон</option>
    <option value="bloc">BLoC</option>
    <option value="cubit-list">Cubit list</option>
  </select>
</template>

<script>
export default {
  name: "SelectBox",
  props: {
    select: { type: String, default: "Template select" }
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