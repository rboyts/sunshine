<template>
  <div class="s-datepicker" style="margin: 0 auto;">
    <div class="s-datepicker__header">
      <div class="flex flex-even s-datepicker__navigation">
        <i class="fa fa-fw fa-chevron-left" @click="subtractMonth"></i>
        <h4>{{month + ' - ' + year}}</h4>
        <i class="fa fa-fw fa-chevron-right" @click="addMonth"></i>
      </div>
      <ul class="s-datepicker__days">
        <li class="s-datepicker__day" v-for="(day, i) in days" :key="'Day' + i">{{day}}</li>
      </ul>
    </div>
    <div id="scrollContainer" @scroll="onCalendarScroll" class="s-datepicker__scrollcontainer">
      <div class="s-datepicker__grid__container">
        <span
          class="s-datepicker__grid"
          v-for="(n, k) in getDaysInMonths(year)"
          :ref="stringifyMonth(n.month) + '-' + year"
          :id="'month'+stringifyMonth(n.month) + '-' + year"
          :key="'current-year-'+n.month + n"
        >
          <h3 class="s-datepicker__month">{{translateMonthName(k)}} - {{year}}</h3>
          <div class="s-datepicker__weeks">
            <span
              class="s-datepicker__weeks__week"
              v-for="w in n.weeksInMonth"
              :key="'weeknumber-' + w + n"
            >{{w}}</span>
          </div>
          <span
            class="s-datepicker__date--overlapping"
            v-for="x in n.previousMonthDays"
            :key="'offset-first-'+n.month + n + x"
          >{{x}}</span>
          <span
            class="s-datepicker__date"
            v-for="a in n.daysInMonth"
            :key="'date'+n.month + n + a"
          >{{a}}</span>
          <span
            class="s-datepicker__date--overlapping"
            v-for="x in (6 - n.lastDay)"
            :key="'offset-last-'+n.month + n + x"
          >{{x}}</span>
        </span>
      </div>
    </div>
    <div class="s-datepicker__menu">
      <p></p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { IMonth } from "./types";
const VueScrollTo = require("vue-scrollto");

moment.locale("nb");

Vue.use(VueScrollTo, {
  container: "#scrollContainer",
  duration: 200,
  easing: "ease",
  offset: 0,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
});

export default Vue.extend({
  name: "s-datepicker",
  data() {
    return {
      today: moment(),
      dateContext: moment(),
      weekNumbers: moment().weeksInYear(),
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      days: ["M", "T", "O", "T", "F", "L", "S"],
      monthXPositions: {} as any,
      VueScrollTo: VueScrollTo
    };
  },
  mounted() {
    this.xPositionsOfMonths();
  },
  computed: {
    scrollContainer(): HTMLElement {
      return this.$el.querySelector("#scrollContainer") as HTMLElement;
    },
    currentYear(): IMonth[] {
      return this.getDaysInMonths(Number(this.year));
    },
    year(): string {
      return this.dateContext.format("Y");
    },
    month(): string {
      return this.dateContext.format("MMMM");
    },
    daysInMonth(): number {
      return this.dateContext.daysInMonth();
    },
    currentDate(): number {
      return this.dateContext.get("date");
    },
    firstDayOfMonth(): number {
      let firstDay = moment(this.dateContext).subtract(
        this.currentDate - 1,
        "days"
      );
      return firstDay.weekday();
    },
    initialDate(): number {
      return this.today.get("date");
    },
    initialMonth(): string {
      return this.today.format("MMMM");
    },
    initialYear(): string {
      return this.today.format("Y");
    },
    scrollToMonth(): string {
      return "#month" + this.dateContext.format("MM-YYYY");
    }
  },
  methods: {
    xPositionsOfMonths() {
      // Should be recalculated when year changes
      let months: any = {};
      for (let a = 0, b = this.months.length; a < b; a++) {
        let element = this.$refs[
          this.stringifyMonth(this.months[a]) + "-" + this.year
        ] as HTMLElement[];
        this.monthXPositions[element[0].offsetTop] =
          this.stringifyMonth(this.months[a]) + "-01-" + this.year;
      }
    },
    subtractMonth() {
      this.VueScrollTo.scrollTo(
        "#month" +
          moment(this.dateContext)
            .subtract(1, "M")
            .format("MM-YYYY"),
        { offset: -90 }
      );
    },
    addMonth() {
      this.VueScrollTo.scrollTo(
        "#month" +
          moment(this.dateContext)
            .add(1, "M")
            .format("MM-YYYY"),
        { offset: -90 }
      );
    },
    onCalendarScroll() {
      let array = Object.keys(this.monthXPositions);
      let scrollX = this.scrollContainer.scrollTop;
      // TODO: Write a more accurate filter to find current month
      // el.offsetTop + el.scrollHeigth (192, 384, ...)
      let position = array.find(function(element) {
        return scrollX >= Number(element) && scrollX <= Number(element) + 192;
      });
      if (
        this.dateContext.format("MM-YYYY") !==
        this.monthXPositions[String(position)]
      ) {
        this.dateContext = moment(this.monthXPositions[String(position)]);
      }
    },
    stringifyMonth(monthKey: number): string {
      let monthString;
      if (monthKey <= 9) {
        monthString = "0" + monthKey;
      } else {
        monthString = "" + monthKey;
      }
      return monthString;
    },
    translateMonthName(monthKey: number) {
      // return name of month 0 - 11
      monthKey = monthKey + 1;
      return moment("2019-" + this.stringifyMonth(monthKey)).format("MMMM");
    },
    offsetStartDay(year: number, month: number) {
      return moment(year + "-" + this.stringifyMonth(month) + "-01")
        .startOf("month")
        .weekday();
    },
    offsetEndDay(year: number, month: number) {
      return moment(year + "-" + this.stringifyMonth(month) + "-01")
        .endOf("month")
        .weekday();
    },
    getDaysInMonths(year: number): IMonth[] {
      let months: IMonth[] = [];
      for (let a = 0, b = this.months.length; a < b; a++) {
        months.push({
          month: this.months[a],
          weeksInMonth: [],
          firstDay: this.offsetStartDay(year, this.months[a]),
          lastDay: this.offsetEndDay(year, this.months[a]),
          daysInMonth: moment(
            year + "-" + this.stringifyMonth(this.months[a])
          ).daysInMonth(),
          previousMonthDays: []
        });
      }
      this.addOverlapDays(months);
      this.addWeekNumbers(months, year);
      return months;
    },
    addOverlapDays(months: IMonth[]): IMonth[] {
      for (let a = 0, b = months.length; a < b; a++) {
        let dateToSubtractFrom: number;
        if (a === 0) {
          // If january, get last day from previous years last month
          let lastYear = parseInt(this.year, 1) - 1;
          dateToSubtractFrom = moment(lastYear + "-12").daysInMonth();
        } else {
          dateToSubtractFrom = months[a - 1].daysInMonth;
        }
        if (months[a].firstDay > 0) {
          // Add lastdays from previous month
          for (let c = months[a].firstDay - 1, d = 0; c >= d; c--) {
            months[a].previousMonthDays.push(dateToSubtractFrom - c);
          }
        }
      }
      return months;
    },
    addWeekNumbers(months: IMonth[], year: number) {
      for (let a = 0, b = months.length; a < b; a++) {
        for (let c = 1, d = months[a].daysInMonth; c <= d; c++) {
          let week = moment(year + "-" + (a + 1) + "-" + c).week();
          if (!months[a].weeksInMonth.includes(week)) {
            months[a].weeksInMonth.push(week);
          }
        }
      }
    }
  }
});
</script>
