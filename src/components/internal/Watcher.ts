import Vue from 'vue';

// An abstract component that emits `trigger` event on every animation frame
export default Vue.extend({
  methods: {
    startWatcher(this: any) {
      this.stopWatcher();

      const startTimer = () => {
        this._watcherHandle = window.requestAnimationFrame(() => {
          this.$emit('trigger');
          startTimer();
        });
      };

      startTimer();
    },

    stopWatcher(this: any) {
      window.cancelAnimationFrame(this._watcherHandle);
      this._watcherHandle = null;
    },
  },

  mounted() {
    this.startWatcher();
  },

  beforeDestroy() {
    this.stopWatcher();
  },

  render: h => h(),
});
