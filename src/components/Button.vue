<template functional>
  <button class="btn" v-on="listeners">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.btn {
  margin: 0;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 14px;
  border: 1px solid #999;
  background-color: #e8e8e8;
}

.btn:hover {
  background-color: #f1f1f1;
}
</style>
