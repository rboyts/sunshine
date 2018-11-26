<template>

    <ui-inspector>
      <div slot="heading">
        <h1>25.08.2018</h1>
        Tor Erik Olsen
      </div>


      <ui-accordion>
        <ui-accordion-item>
          <template slot="heading">Timeføring</template>

          <div class="grid">
            <ui-text-field v-model="from" label="Fra" format="00:00" />
            <ui-text-field v-model="to" label="Til" format="00:00" />
            <ui-text-field v-model="pause" label="Pause" />
            <ui-text-field inactive label="Timer" value="7,5" />
          </div>

          <p>
            Dette er en kommentar
          </p>
        </ui-accordion-item>

        <ui-accordion-item>
          <template slot="heading">Prosjekt og aktivitet</template>

          <div class="grid">
            <ui-text-field class="col4" v-model="project" label="Prosjekt" />
            <ui-text-field class="col4" v-model="subProject" label="Underprosjekt" />

            <ui-text-field class="col12" v-model="activity" label="Aktivitet" />
            <ui-text-field class="col34" v-model="area" label="Område" />
          </div>
        </ui-accordion-item>

        <ui-accordion-item>
          <template slot="heading">Lønn og tillegg</template>

          <p>
            Lønn og tillegg
          </p>
        </ui-accordion-item>

        <ui-accordion-item>
          <template slot="heading">Maskintimer</template>

          <p>
            Maskintimer
          </p>
        </ui-accordion-item>

      </ui-accordion>
    </ui-inspector>
</template>

<script lang="ts">
import Vue from 'vue';
import UiAccordion from '@/components/UiAccordion.vue';
import UiAccordionItem from '@/components/UiAccordionItem.vue';
import UiInspector from '@/components/UiInspector.vue';
import UiTextField from '@/components/UiTextField.vue';

export default Vue.extend({
  name: 'InspectorDemo',

  components: {
    UiAccordion,
    UiAccordionItem,
    UiInspector,
    UiTextField,
  },

  data() {
    return {
      from: '09:00',
      to: '16:00',
      pause: '30',
      project: '2tal Utemiljø',
      subProject: '',
      activity: 'Boring',
      area: '',
    };
  },
});
</script>
