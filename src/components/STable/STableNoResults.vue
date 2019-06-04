<template>
  <div :class="$class()">
    <img src="../../icons/svg/icon-circle-background.svg">
    <img
      :class="$class('search')"
      src="../../icons/svg/search.svg"
      alt="Search icon"
    >
    <div :class="$class('header')">
      {{ $t('s-table-no-result.no-result') }}
    </div>
    <div>
      {{ $t('s-table-no-result.hint') }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'STableNoResult',
});
</script>
