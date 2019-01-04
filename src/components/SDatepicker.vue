<template>
    <div :class="classes()">
        <h2>{{ today.format('LLLL') }}</h2>
        <div class="flex flex-even">
            <i class="fa fa-fw fa-chevron-left" @click="subtractMonth"></i>
            <h4>{{month + ' - ' + year}}</h4>
            <i class="fa fa-fw fa-chevron-right" @click="addMonth"></i>
        </div>
        <ul class="s-datepicker__grid">
            <li class="s-datepicker__day" v-for="(day, i) in days" :key="'Day' + i">{{day}}</li>
        </ul>
        <div class="s-datepicker__grid">
            <ul class="s-datepicker__weeks">
                <li class="s-datepicker__weeks__week" v-for="(number, i) in weekNumbers" :key="'Week' + i">
                    {{number}}
                </li>
            </ul>
            <span v-for="(blank, i) in firstDayOfMonth" :key="'Blank' + i">&nbsp;</span>
            <span class="s-datepicker__day" v-for="n in getDaysInMonths(year)" :key="n.date">{{n.number}}</span>
            
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';

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
        }
    },
    methods: {
        addMonth() {
            // this.dateContext = moment(this.dateContext).add(1, 'month');
        },
        subtractMonth() {
            // this.dateContext = moment(this.dateContext).subtract(1, 'month');
        },
        getDaysInMonths(year: number) {
            let months: object[] = []
            for (let a = 0, b = this.months.length; a < b; a++) {
                for (let c = 1, d = moment(this.year + '-' + this.months[a]).daysInMonth(); c <= d; c++) {
                    months.push({
                        date: this.year + '-' + this.months[a] + '-' + c,
                        number: c
                    })
                }
            }
            return months
        },
        getFirstDayOfMonth() {
            console.log()
        },
    },
});

</script>
