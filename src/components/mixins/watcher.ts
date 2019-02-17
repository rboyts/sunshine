import Vue from 'vue';

// A mixin that calls `onWatcher` on every animation frame when active
export default Vue.extend({
  methods: {
    startWatcher(this: any) {
      this.stopWatcher();

      const startTimer = () => {
        this._watcherHandle = window.requestAnimationFrame(() => {
          this.onWatcher();
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
});
