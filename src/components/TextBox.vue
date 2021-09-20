<template>
  <input class="text-box text" :placeholder="placeholder" @change="e => $emit('input', e.target.value)" :value="value" :disabled="disabled">
</template>

<script>
export default {
  name: "TextBox",
  props: {
    value: {type: String, default: "Name bloc"},
    placeholder: {type: String, default: "Name bloc"},
    disabled: {type: Boolean, default: false},
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style";

.text-box {
  border-radius: 40px;
  padding: 9px 14px;
  border: 1px solid $color-gray-100;

  &:focus-visible {
    border-radius: 40px !important;
    border: 1px solid $color-gray-600 !important;
    outline: none !important;
  }
}

.text {
  color: $color-gray-600;
  @include roboto-14-regular;
}
</style>