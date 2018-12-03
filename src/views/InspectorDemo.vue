<template>
  <div>
    <div class="toggle" @click="open = !open">
      <i class="fas fa-bars" />
    </div>

    <ui-inspector v-model="open">
      <div slot="header">
        <h1>25.08.2018</h1>
        Tor Erik Olsen
      </div>

      <div slot="footer">
        <div class="flex">
          <ui-button primary>Godkjenn</ui-button>
        </div>
      </div>

      <ui-accordion>
        <ui-accordion-item>
          <template slot="heading">Timeføring</template>

          <div class="grid">
            <ui-text-field class="grid-item--span-3" v-model="from" label="Fra" format="00:00" />
            <ui-text-field class="grid-item--span-3" v-model="to" label="Til" format="00:00" />
            <ui-text-field class="grid-item--span-3" v-model="pause" label="Pause" />
            <ui-text-field class="grid-item--span-3" inactive label="Timer" value="7,5" />
          </div>

          <p>
            Dette er en kommentar
          </p>
        </ui-accordion-item>

        <ui-accordion-item>
          <template slot="heading">Prosjekt og aktivitet</template>

          <div class="grid">
            <ui-text-field class="grid-item--span-12" v-model="project" label="Prosjekt" />

            <ui-text-field class="grid-item--span-9" v-model="subProject" label="Underprosjekt" />
            <ui-text-field class="grid-item--span-3" v-model="pause" label="Antall" />

            <ui-text-field class="grid-item--span-6" v-model="activity" label="Aktivitet" />
            <ui-text-field class="grid-item--span-6" v-model="area" label="Område" />
          </div>
        </ui-accordion-item>

        <ui-accordion-item>
          <template slot="heading">Lønn og tillegg</template>

          <div class="grid">
            <ui-text-field class="grid-item--span-9" v-model="wage" label="Lønnsart" />
            <ui-text-field class="grid-item--span-3" v-model="pause" label="Antall" />
            <ui-text-field v-for="i in 20" class="grid-item--span-6" :key="i" :label="`Tillegg ${i}`" />
          </div>
        </ui-accordion-item>

        <ui-accordion-item>
          <template slot="heading">Maskintimer</template>

          <p>
            Maskintimer
          </p>
        </ui-accordion-item>

      </ui-accordion>
    </ui-inspector>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UiAccordion from '@/components/UiAccordion.vue';
import UiAccordionItem from '@/components/UiAccordionItem.vue';
import UiButton from '@/components/UiButton.vue';
import UiInspector from '@/components/UiInspector.vue';
import UiTextField from '@/components/UiTextField.vue';

export default Vue.extend({
  name: 'InspectorDemo',

  components: {
    UiAccordion,
    UiAccordionItem,
    UiButton,
    UiInspector,
    UiTextField,
  },

  data() {
    return {
      open: false,
      from: '09:00',
      to: '16:00',
      pause: '30',
      project: '2tal Utemiljø',
      subProject: '',
      activity: 'Boring',
      wage: '',
      area: '',
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../style/settings.scss';

.toggle {
  position: absolute;
  top: 0;
  right: 0;
  height: 2.5rem;
  width: 2.5rem;
  line-height: 2.5rem;
  background-color: $white;
  text-align: center;
  z-index: 10000;
  cursor: pointer;
}
</style>

