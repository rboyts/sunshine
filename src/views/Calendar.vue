<template>
  <div>
    <h2>Calendar demo</h2>

    <calendar />
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import Calendar from '@/components/Calendar.vue';

export default Vue.extend({
  components: {
    Calendar,
  },
})
</script>

