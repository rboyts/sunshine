<template>
  <div class="s-saved-setups">
    <s-drop-down
      search
      v-model="selected"
      :label="$t('saved-setups')"
      :items="items"
    >
      <template v-slot:above>
        <s-list-item @click="onNew">
          <b>+ {{ $t('add-as-new') }}</b>
        </s-list-item>
        <s-list-separator />
      </template>

      <template v-slot="{label, item, onClick}">
        <s-list-item @click="onClick">
          <span class="flex-grow">{{ label }}</span>
          <a
            tabIndex="-1"
            href="#"
            @click.prevent.stop="onEdit(item)"
          >{{ $t('update') }}</a>
        </s-list-item>
      </template>
    </s-drop-down>

    <s-dialog
      v-model="showDialog"
      :heading="headingText"
      @submit.prevent="onSave"
    >
      <div
        class="flex-layout-down"
        :style="{width: '330px'}"
      >
        <div>
          You can save table views with selected filters,
          sortings, and period selections. Give this table a
          suitable name so you can find it later.
        </div>
        <s-text-field
          v-model="editText"
          label="Name"
        />
        <div class="flex-layout flex-end">
          <s-button
            v-if="editItem"
            danger
            @click="onDelete"
          >
            Delete
          </s-button>
          <s-button
            primary
            submit
            :inactive="!hasValidName"
          >
            Save
          </s-button>
        </div>
      </div>
    </s-dialog>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'SSavedSetups',

  i18n: {
    messages: {
      en: {
        'saved-setups': 'Saved setups',
        'add-as-new': 'Save current setup',
        update: 'Update',
      },

      nb: {
        'saved-setups': 'Lagrede oppsett',
        'add-as-new': 'Lagre gjeldende oppsett',
        update: 'Oppdater',
      },
    },
  },

  props: {
    items: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      selected: null,
      showDialog: false,
      editItem: null,
      editText: '',
    };
  },

  watch: {
    selected(val) {
      if (val) {
        this.$emit('select', val);
      }
    },
  },

  computed: {
    headingText() {
      return this.editItem ? 'Edit setup' : 'Save this table setup';
    },

    hasValidName() {
      if (this.editText === '') return false;
      if (this.editItem && this.editText === this.editItem.label) return true;
      return !this.items.find(i => i.label === this.editText);
    },
  },

  methods: {
    onNew() {
      this.editItem = null;
      this.editText = '';
      this.showDialog = true;
    },

    onEdit(item) {
      this.editItem = item;
      this.editText = item.label;
      this.showDialog = true;
    },

    onSave() {
      let label = this.editText;
      this.$emit('save', this.editItem, this.editText);
      this.showDialog = false;
      // HACK Relies on the key being idenitcal to the label
      Vue.nextTick(() => {
        this.selected = label;
      });
    },

    onDelete() {
      this.$emit('delete', this.editItem);
      this.showDialog = false;
    },
  },
});
</script>
