<template>
  <li :class="classes()" />
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import ClassesMixin from './internal/ClassesMixin';

export default mixins(ClassesMixin).extend({
  name: 's-list-separator',
});
</script>
