<script lang="ts">
import Vue, { VNode } from 'vue';
import moment from 'moment';

export default Vue.extend({
  name: 'ui-calendar-internal',

  props: {
    date: Object as () => moment.Moment,
  },

  methods: {
    renderHeader(): VNode[] {
      const h = this.$createElement;
      let weekdays = moment.weekdays();
      let start = moment(this.date).startOf('isoWeek');
      let end = moment(this.date).endOf('isoWeek');

      let children: VNode[] = [];
      for (let d = start; d < end; d = d.add(1, 'day')) {
        children.push(h('span', {
            class: 'ui-calendar__header',
          },
          weekdays[d.day()]));
      }

      return children;
    },

    renderMonth(): VNode[] {
      let start = moment(this.date).startOf('month').startOf('isoWeek');
      let end = moment(this.date).endOf('month').endOf('isoWeek');

      let children: VNode[] = [];
      for (let d = start; d < end; d = d.add(1, 'day')) {
        children.push(this.renderCell(d));
      }

      return children;
    },

    renderCell(date: moment.Moment) {
      const h = this.$createElement;

      const d = date.format('D');
      const text = date.format('LLLL');
      return h('span', {
        class: {
          'ui-calendar__day': true,
          'ui-calendar__day--weekend': date.day() === 6 || date.day() === 0,
          'ui-calendar__day--other-month': date.month() !== this.date.month(),
        },
      },
      [
        h('span', {
          class: {
            'ui-calendar__date': true,
            'ui-calendar__date--sunday': date.day() === 0,
          },
        }, d),
      ]);
    },
  },

  render(): VNode {
    const h = this.$createElement;
    return h('div', {class: 'ui-calendar'}, [
      this.renderHeader(),
      this.renderMonth(),
    ]);
  },
});
</script>