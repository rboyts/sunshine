<template>
  <div :class="$class()">
    <img src="../../icons/svg/icon-circle-background.svg">
    <img
      :class="$class('search')"
      src="../../icons/svg/search.svg"
      alt="Search icon"
    >
    <div :class="$class('header')">
      No results found
    </div>
    <div>
      Try to add different filters
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'STableNoResult',
});
</script>
