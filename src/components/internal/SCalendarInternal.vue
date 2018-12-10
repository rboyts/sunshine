<script lang="ts">
import Vue, { VNode } from 'vue';
import moment from 'moment';

export default Vue.extend({
  name: 's-calendar-internal',

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
            class: 's-calendar__header',
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
          's-calendar__day': true,
          's-calendar__day--weekend': date.day() === 6 || date.day() === 0,
          's-calendar__day--other-month': date.month() !== this.date.month(),
        },
      },
      [
        h('span', {
          class: {
            's-calendar__date': true,
            's-calendar__date--sunday': date.day() === 0,
          },
        }, d),
      ]);
    },
  },

  render(): VNode {
    const h = this.$createElement;
    return h('div', {class: 's-calendar'}, [
      this.renderHeader(),
      this.renderMonth(),
    ]);
  },
});
</script>