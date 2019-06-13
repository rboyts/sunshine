<template>
  <div :class="$class()">
    <div :class="$class('circle')">
      <div
        class="sunshine24-search"
        :class="$class('search')"
      />
    </div>
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
  name: 'STableNoResults',
});
</script>
