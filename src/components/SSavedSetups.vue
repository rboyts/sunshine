<template>
  <div class="s-saved-setups">
    <s-drop-down
      v-model="selected"
      :label="$t('s-saved-setups.label')"
      :items="items"
    >
      <template v-slot:icon>
        <s-icon
          package="sunshine24"
          name="saved-setups"
        />
      </template>

      <template v-slot:above>
        <s-list-item @click="onNew">
          <b>+ {{ $t('s-saved-setups.add-as-new') }}</b>
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
          >{{ $t('s-saved-setups.update') }}</a>
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
          {{ $t('s-saved-setups.help') }}
        </div>
        <s-text-field
          v-model="editText"
          :label="$t('s-saved-setups.name')"
        />
        <div class="flex-layout flex-end">
          <s-button
            v-if="editItem"
            danger
            @click="onDelete"
          >
            {{ $t('action.delete') }}
          </s-button>
          <s-button
            primary
            submit
            :inactive="!hasValidName"
          >
            {{ $t('action.save') }}
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
      return this.editItem ? this.$t('s-saved-setups.header-edit') : this.$t('s-saved-setups.header-save');
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
