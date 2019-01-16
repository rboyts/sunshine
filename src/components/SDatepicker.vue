<template>
    <div class="s-datepicker" style="margin: 0 auto;">
        <div class="s-datepicker__header">
            <!--<div class="flex flex-even s-datepicker__navigation">
                <i 
                    class="fa fa-fw fa-chevron-left" 
                    @click="subtractMonth"
                    v-scroll-to="{
                        el: scrollToMonth,
                    }"
                ></i>
                <h4>{{month + ' - ' + year}}</h4>
                <i 
                    class="fa fa-fw fa-chevron-right"
                    @click="addMonth"
                    v-scroll-to="{
                        el: scrollToMonth,
                    }"
                >
                </i>
            </div>-->
            <button>previous year</button>
            <button>next year</button>
        </div>
        <div 
            id="scrollContainer" 
            class="s-datepicker__scrollcontainer">
            <ul class="s-datepicker__days">
                <li class="s-datepicker__day" v-for="(day, i) in days" :key="'Day' + i">{{day}}</li>
            </ul>
            <div class="s-datepicker__grid__container">

                <!-- TODO: Move years into some kind of render loop -->

                <!-- PREVIOUS YEAR -->
                <span 
                    class="s-datepicker__grid" 
                    v-for="(n, k) in previousYear"
                    :ref="(Number(year) - 1)"
                    :key="'previous-year-'+n.month + n" 
                    :id="'month' + stringifyMonth(n.month) + '-' + (Number(year) - 1)"
                >
                    <h3 class="s-datepicker__month">{{translateMonthName(k)}} - {{Number(year) - 1}}</h3>
                    <div class="s-datepicker__weeks">
                        <span 
                            class="s-datepicker__weeks__week" 
                            v-for="w in n.weeksInMonth" 
                            :key="'weeknumber-' + w + n">{{w}}</span>
                    </div>
                    <span 
                        class="s-datepicker__date--overlapping" 
                        v-for="x in n.previousMonthDays" 
                        :key="'offset-first-'+n.month + n + x">{{x}}</span>
                    <span 
                        class="s-datepicker__date" 
                        v-for="a in n.daysInMonth" 
                        :key="'date'+n.month + n + a">{{a}}</span>
                    <span class="s-datepicker__date--overlapping" v-for="x in (6 - n.lastDay)" :key="'offset-last-'+n.month + n + x">{{x}}</span>
                </span>

                <!-- CURRENT YEAR -->
                <span 
                    class="s-datepicker__grid" 
                    v-for="(n, k) in currentYear" 
                    :ref="(Number(year))"
                    :key="'current-year-'+n.month + n" 
                    :id="'month' + stringifyMonth(n.month) + '-' + year"
                >
                    <h3 class="s-datepicker__month">
                        {{translateMonthName(k)}} - {{year}}
                    </h3>
                    <div class="s-datepicker__weeks">
                        <span 
                            class="s-datepicker__weeks__week" 
                            v-for="w in n.weeksInMonth" 
                            :key="'weeknumber-' + w + n">{{w}}</span>
                    </div>
                    <span 
                        class="s-datepicker__date--overlapping" 
                        v-for="x in n.previousMonthDays" 
                        :key="'offset-first-'+n.month + n + x">{{x}}</span>
                    <span 
                        class="s-datepicker__date" 
                        v-for="a in n.daysInMonth" 
                        :key="'date'+n.month + n + a">{{a}}</span>
                    <span class="s-datepicker__date--overlapping" v-for="x in (6 - n.lastDay)" :key="'offset-last-'+n.month + n + x">{{x}}</span>
                </span>

                <!-- NEXT YEAR -->
                <span 
                    class="s-datepicker__grid" 
                    v-for="(n, k) in nextYear" 
                    :ref="(Number(year) + 1)"
                    :key="'next-year-'+n.month + n" 
                    :id="'month' + stringifyMonth(n.month) + '-' + (Number(year) + 1)"
                >
                    <h3 class="s-datepicker__month">{{translateMonthName(k)}} - {{Number(year) + 1}}</h3>
                    <div class="s-datepicker__weeks">
                        <span 
                            class="s-datepicker__weeks__week" 
                            v-for="w in n.weeksInMonth" 
                            :key="'weeknumber-' + w + n">{{w}}</span>
                    </div>
                    <span 
                        class="s-datepicker__date--overlapping" 
                        v-for="x in n.previousMonthDays" 
                        :key="'offset-first-'+n.month + n + x">{{x}}</span>
                    <span 
                        class="s-datepicker__date" 
                        v-for="a in n.daysInMonth" 
                        :key="'date'+n.month + n + a">{{a}}</span>
                    <span class="s-datepicker__date--overlapping" v-for="x in (6 - n.lastDay)" :key="'offset-last-'+n.month + n + x">{{x}}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment,{ Moment } from 'moment';
import {IMonth} from './types';
const VueScrollTo = require('vue-scrollto');

moment.locale('nb');

export default Vue.extend({
    name: 's-datepicker',
    data() {
        return {
            flag: true,
            today: moment(),
            dateContext: moment(),
            weekNumbers: moment().weeksInYear(),
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            days: ['M', 'T', 'O', 'T', 'F', 'L', 'S'],
            monthsWithDates: [],
        };
    },
    created() {
        Vue.use(VueScrollTo, {
            container: '#scrollContainer',
            duration: 200,
            easing: 'ease',
            offset: 0,
            force: true,
            cancelable: true,
            onStart: false,
            onDone: false,
            onCancel: false,
            x: false,
            y: true,
        });
    },
    mounted() {
        VueScrollTo.scrollTo('#month01-2019', {offset: -70});
    },
    computed: {
        scrollContainer(): HTMLElement {
            return this.$el.querySelector('#scrollContainer') as HTMLElement;
        },
        previousYear(): IMonth[] {
            let prevYear = Number(this.year) - 1;
            return this.getDaysInMonths(prevYear);
        },
        currentYear(): IMonth[] {
            return this.getDaysInMonths(Number(this.year));
        },
        nextYear(): IMonth[] {
            return this.getDaysInMonths(Number(this.year) + 1);
        },
        year(): string {
            return this.dateContext.format('Y');
        },
        month(): string {
            return this.dateContext.format('MMMM');
        },
        daysInMonth(): number {
            return this.dateContext.daysInMonth();
        },
        currentDate(): number {
            return this.dateContext.get('date');
        },
        firstDayOfMonth(): number {
            let firstDay = moment(this.dateContext).subtract((this.currentDate - 1), 'days');
            return firstDay.weekday();
        },
        initialDate(): number {
            return this.today.get('date');
        },
        initialMonth(): string {
            return this.today.format('MMMM');
        },
        initialYear(): string {
            return this.today.format('Y');
        },
        scrollToMonth(): string {
            return '#month' + this.dateContext.format('MM-YYYY');
        },
        xPositionOfPreviousYear(): number {
            let prevYear = this.$refs[Number(this.year) - 1] as HTMLElement[];
            return prevYear[0].offsetTop;
        },
        xPositionOfActiveYear(): number {
            let activeYear = this.$refs[Number(this.year)] as HTMLElement[];
            return activeYear[0].offsetTop;
        },
        xPositionOfNextYear(): number {
            let nextYear = this.$refs[Number(this.year) + 1] as HTMLElement[];
            return nextYear[0].offsetTop
        },
    },
    methods: {
        subtractMonth() {
            // this.dateContext = moment(this.dateContext).subtract(1, 'M');
            console.log(this.dateContext.format('MM-YYYY'));
        },
        addMonth() {
            // this.dateContext = moment(this.dateContext).add(1, 'M');
            console.log(this.dateContext.format('MM-YYYY'));
        },
        stringifyMonth(monthKey: number): string {
            let monthString;
            if (monthKey <= 9) {
                monthString = '0' + monthKey;
            } else {
                monthString = '' + monthKey;
            }
            return monthString;
        },
        translateMonthName(monthKey: number) {
            // return name oF month 0 - 11
            monthKey = monthKey + 1;
            return moment('2019-' + this.stringifyMonth(monthKey)).format('MMMM');
        },
        offsetStartDay(year: number, month: number) {
            return moment(year + '-' + this.stringifyMonth(month) + '-01').startOf('month').weekday();
        },
        offsetEndDay(year: number, month: number) {
            return moment(year + '-' + this.stringifyMonth(month) + '-01').endOf('month').weekday();
        },
        getDaysInMonths(year: number): IMonth[] {
            let months: IMonth[] = [];
            for (let a = 0, b = this.months.length; a < b; a++) {
                months.push({
                    month: this.months[a],
                    weeksInMonth: [],
                    firstDay: this.offsetStartDay(year, this.months[a]),
                    lastDay: this.offsetEndDay(year, this.months[a]),
                    daysInMonth: moment(year + '-' + this.stringifyMonth(this.months[a])).daysInMonth(),
                    previousMonthDays: [],
                });
            }
            this.addOverlapDays(months);
            this.addWeekNumbers(months, year);
            console.log(year);
            console.log(months);
            return months;
        },
        addOverlapDays(months: IMonth[]): IMonth[] {
            for (let a = 0, b = months.length; a < b; a++) {
                let dateToSubtractFrom: number;
                if (a === 0) {
                    // If january, get last day from previous years last month
                    let lastYear = parseInt(this.year, 1) - 1;
                    dateToSubtractFrom = moment(lastYear + '-12').daysInMonth();
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
                    let week = moment(year + '-' + (a + 1) + '-' + c).week();
                    if (!months[a].weeksInMonth.includes(week)) {
                        months[a].weeksInMonth.push(week);
                    }
                }
            }
        },
    },
});

</script>
