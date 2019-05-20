<script lang="ts">
import Vue, { VNode } from 'vue';
import { DateTime } from 'luxon';

export default Vue.extend({
  name: 'SCalendarInternal',

  props: {
    date: {
      type: Object as () => DateTime,
      default: () => DateTime.local(),
    },
  },

  methods: {
    renderHeader(): VNode[] {
      const h = this.$createElement;

      const start = this.date.startOf('week');
      const end = this.date.endOf('week');

      let children: VNode[] = [];
      for (let d = start; d < end; d = d.plus({ days: 1 })) {
        children.push(h('span', {
          class: 's-calendar__header',
        },
        d.toFormat('EEEE')));
      }

      return children;
    },

    renderMonth(): VNode[] {
      const start = this.date.startOf('month').startOf('week');
      const end = this.date.endOf('month').endOf('week');

      let children: VNode[] = [];
      for (let d = start; d < end; d = d.plus({ days: 1 })) {
        children.push(this.renderCell(d));
      }

      return children;
    },

    renderCell(date: DateTime) {
      const h = this.$createElement;

      const d = date.toFormat('d');
      const text = date.toFormat('LLLL');
      return h('span', {
        class: {
          's-calendar__day': true,
          's-calendar__day--weekend': date.weekday === 6 || date.weekday === 7,
          's-calendar__day--other-month': date.month !== this.date.month,
        },
      },
      [
        h('span', {
          class: {
            's-calendar__date': true,
            's-calendar__date--sunday': date.weekday === 7,
          },
        }, d),
      ]);
    },
  },

  render(): VNode {
    const h = this.$createElement;
    return h('div', { class: 's-calendar' }, [
      this.renderHeader(),
      this.renderMonth(),
    ]);
  },
});
</script>
