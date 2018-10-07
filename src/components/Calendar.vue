<script lang="ts">
import Vue, { VNode } from 'vue';
import moment from 'moment';

export default Vue.extend({
  name: 'calendar',

  methods: {
  },

  render(): VNode {
    const h = this.$createElement;
    return h('div', 'clendar');
  },
});
</script>
