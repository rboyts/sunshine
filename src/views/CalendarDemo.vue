<template>
  <div>
    <h2>Calendar demo</h2>
    <div class="options">
      <button type="button" @click="onPrevClick">&lt;&lt;</button>
      <button type="button" @click="onTodayClick">{{ today }}</button>
      <button type="button" @click="onNextClick">&gt;&gt;</button>
    </div>

    <div>
      <transition :name="transition">
        <div class="month" :key="month">
          <calendar :date="date" />
        </div>
      </transition>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
import Calendar from '@/components/Calendar.vue';

export default Vue.extend({
  name: 'CelanderDemo',

  components: {
    Calendar,
  },

  data() {
    let today = moment().startOf('day');
    return {
      date: today,
      today: today.format('LL'),
      transition: 'slide-left',
    };
  },

  computed: {
    month(): number {
      return this.date.month();
    },
  },

  methods: {
    onPrevClick() {
      this.transition = 'slide-right';
      this.date = moment(this.date).subtract(1, 'month');
    },

    onNextClick() {
      this.transition = 'slide-left';
      this.date = moment(this.date).add(1, 'month');
    },

    onTodayClick() {
      let today = moment().startOf('day');
      if (today < this.date) {
        this.transition = 'slide-right';
      } else {
        this.transition = 'slide-left';
      }
      this.date = today;
    },
  },
});
</script>


<style lang="scss" scoped>
.options {
  margin-bottom: 20px;
  text-align: center;

  button {
    padding: 5px 10px;
    margin: 0 10px;
  }
}

.month {
  position: absolute;
  width: calc(100vw - 120px);
}

.slide-left-enter-active {
  animation: slide-left-in .5s;
  opacity: 0;
}

.slide-left-leave-active {
  animation: slide-left-out .5s;
}

@keyframes slide-left-in {
  from {
    transform: translateX(150px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-left-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-150px);
    opacity: 0;
  }
}

.slide-right-enter-active {
  animation: slide-right-in .5s;
  opacity: 0;
}

.slide-right-leave-active {
  animation: slide-right-out .5s;
}

@keyframes slide-right-in {
  from {
    transform: translateX(-150px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-right-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(150px);
    opacity: 0;
  }
}
</style>
