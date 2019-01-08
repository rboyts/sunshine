<template>
    <div class="s-datepicker" style="margin: 0 auto;">
        <!--<h2>{{ today.format('LLLL') }}</h2>-->
        <div class="s-datepicker__header">
            <div class="flex flex-even s-datepicker__navigation">
                <i class="fa fa-fw fa-chevron-left" @click="subtractMonth"></i>
                <h4>{{month + ' - ' + year}}</h4>
                <i class="fa fa-fw fa-chevron-right" @click="addMonth"></i>
            </div>
        </div>
        <div class="s-datepicker__scrollcontainer">
            <ul class="s-datepicker__days">
                <li class="s-datepicker__day" v-for="(day, i) in days" :key="'Day' + i">{{day}}</li>
            </ul>
            <div class="s-datepicker__grid__container">
                <span class="s-datepicker__grid" v-for="(n, k) in getDaysInMonths(year)" :key="n.month + n">
                    <p class="s-datepicker__month">Mnd: {{translateMonthName(k)}}</p>
                    <div class="s-datepicker__weeks">
                        <span class="s-datepicker__weeks__week" v-for="w in n.weeksInMonth" :key="'weeknumber-' + w + n">{{w}}</span>
                    </div>
                    <!-- <span class="s-datepicker__month">{{n.month}}</span>-->
                    <span class="s-datepicker__date--overlapping" v-for="x in n.previousMonthDays" :key="'offset-first-'+n.month + n + x">{{x}}</span>
                    <span class="s-datepicker__date" v-for="a in n.daysInMonth" :key="'date'+n.month + n + a">{{a}}</span>
                    <span class="s-datepicker__date--overlapping" v-for="x in (6 - n.lastDay)" :key="'offset-last-'+n.month + n + x">{{x}}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
import {IMonth} from './types';

moment.locale('nb');

export default Vue.extend({
    name: 's-datepicker',
    data() {
        return {
            today: moment(),
            dateContext: moment(),
            weekNumbers: moment().weeksInYear(),
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            days: ['M', 'T', 'O', 'T', 'F', 'L', 'S'],
            monthsWithDates: [],
        };
    },
    computed: {
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
    },
    methods: {
        subtractMonth() {
            // Skip to previous month
        },
        addMonth() {
            // Skip to next month
        },
        translateMonthName(monthKey: number) {
            // return name og month 0 - 11
        },
        offsetStartDay(year: number, month: number) {
            let monthString;
            if (month <= 9) {
                monthString = '0' + month;
            } else {
                monthString = '' + month;
            }
            return moment(year + '-' + month + '-01').startOf('month').weekday();
        },
        offsetEndDay(year: number, month: number) {
            let monthString;
            if (month <= 9) {
                monthString = '0' + month;
            } else {
                monthString = '' + month;
            }
            return moment(year + '-' + month + '-01').endOf('month').weekday();
        },
        getDaysInMonths(year: number) {
            let months: IMonth[] = [];
            for (let a = 0, b = this.months.length; a < b; a++) {
                let month;
                if (this.months[a] <= 9) {
                    month = '0' + this.months[a];
                } else {
                    month = '' + this.months[a];
                }
                // TODO: Add weeknumbers to month
                months.push({
                    month: this.months[a],
                    weeksInMonth: [],
                    firstDay: this.offsetStartDay(year, this.months[a]),
                    lastDay: this.offsetEndDay(year, this.months[a]),
                    daysInMonth: moment(year + '-' + month).daysInMonth(),
                    previousMonthDays: [],
                });
            }
            this.addOverlapDays(months);
            this.addWeekNumbers(months);
            console.log(months);
            return months;
        },
        addOverlapDays(months: IMonth[]) {
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
        addWeekNumbers(months: IMonth[]) {
            for (let a = 0, b = months.length; a < b; a++) {
                for (let c = 1, d = months[a].daysInMonth; c <= d; c++) {
                    let week = moment(this.year + '-' + (a + 1) + '-' + c).week();
                    if (!months[a].weeksInMonth.includes(week)) {
                        months[a].weeksInMonth.push(week)
                    }
                }
            }
        },
    },
});

</script>
