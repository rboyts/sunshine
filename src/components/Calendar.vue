<script lang="ts">
import Vue, { VNode } from 'vue';
import moment from 'moment';

export default Vue.extend({
  name: 'calendar',

  props: {
    date: {
      type: Object as () => moment.Moment,
      default: () => moment(),
    },
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
            class: 'weekday',
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
          'day': true,
          'weekend': date.day() === 6 || date.day() === 0,
          'other-month': date.month() !== this.date.month(),
        },
      },
      [
        h('span', {
          class: {
            'date': true,
            'sunday': date.day() === 0,
          },
        }, d),
        // h('span', {class: 'text'}, text),
      ]);
    },
  },

  render(): VNode {
    const h = this.$createElement;
    return h('div', {class: 'calendar'}, [
      this.renderHeader(),
      this.renderMonth(),
    ]);
  },
});
</script>


<style lang="scss" scoped>

$inner-border-width: 1px;
$inner-border: $inner-border-width solid #ccc;

.calendar {
  display: grid;

  border-radius: 3px;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: auto;
  grid-auto-rows: 100px;

  > span {
    padding: 8px;

    // Ensures that columns are always equally wide
    min-width: 0;

    overflow: hidden;
    text-overflow: ellipsis;

    border: $inner-border;
    margin-right: -$inner-border-width;
    margin-bottom: -$inner-border-width;
  }
}

.weekday {
  background-color: #efefef;
}

.date {
  float: right;
  font-size: .9em;
  // font-weight: bold;
}

.text {
  font-size: .7em;
}

.day {
  background-color: #fff;
}

.weekend .date {
  // background-color: #efefef;
}

.sunday {
  color: red;
}

.other-month {
  background-color: #efefef;
}
</style>
