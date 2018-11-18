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

    <h2>Alert with icon or actions</h2>

    <ui-alert success>
      <ui-icon name="hourglass"></ui-icon>
      Your free trail has been extended with 14-days. Enjoy!
    </ui-alert>

    <ui-alert warning>
      <ui-icon name="password"></ui-icon>
      Your password has not been changed in 2 months.

      <div slot="buttons">
        <ui-button small>Remind me later</ui-button>
        <ui-button small primary>Change now</ui-button>
      </div>
    </ui-alert>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UiAlert from '@/components/UiAlert.vue';
import UiIcon from '@/components/UiIcon.vue';
import UiButton from '@/components/UiButton.vue';

export default Vue.extend({
  name: 'AlertsDemo',

  components: {
    UiAlert,
    UiIcon,
    UiButton,
  },
});
</script>
