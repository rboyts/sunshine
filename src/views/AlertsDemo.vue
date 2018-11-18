<template>
  <div>
    <h2>Basic alerts</h2>

    <ui-alert success>Success! Data transfered successfully.</ui-alert>

    <ui-alert warning>
      Light warning: We have planned maintenance this evening from
      23:00 to 01:30.
    </ui-alert>

    <ui-alert error>
      Serious warning: I’m sorry, Dave. I'm afraid I can't do that.
    </ui-alert>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UiAlert from '@/components/UiAlert.vue';

export default Vue.extend({
  name: 'AlertsDemo',

  components: {
    UiAlert,
  },
});
</script>
