<template>
  <div class="navigation-arrow-drop-down">
    <img
        alt=""
        class="icon-mask"
        src="https://via.placeholder.com/7x4"
    />
  </div>
</template>

<script>
export default {
  name: "NavigationArrowDropDown"
};
</script>

<style lang="scss" scoped>
.navigation-arrow-drop-down {
  padding: 4px 2.5px;
  display: flex;
  align-items: center;
}
.icon-mask {
  flex: 1;
  align-self: stretch;
  object-fit: cover;
}
</style>