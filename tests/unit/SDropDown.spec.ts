import { mount, config } from '@vue/test-utils';
import SDropDown from '@/components/SDropDown.vue';

config.logModifiedComponents = false;

describe('SDropDown', () => {
  it('renders dropdown list', () => {
    const wrapper = mount(SDropDown, {
      propsData: {
        items: [
          { key: 'no', label: 'Norge' },
          { key: 'sv', label: 'Sverige' },
          { key: 'en', label: 'England' },
        ],
        label: 'Choose country',
      },
    });
    // Open menu
    wrapper.find('.s-drop-down__caret').trigger('click');
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders filtered list', async () => {
    const wrapper = mount(SDropDown, {
      propsData: {
        search: true,
        labelKey: 'title',
        items: [
          { key: 'no', title: 'Norge' },
          { key: 'sv', title: 'Sverige' },
          { key: 'en', title: 'England' },
        ],
        label: 'Choose country',
      },
    });
    // Open menu
    let input = wrapper.find('input');
    input.trigger('click');
    input.setValue('sve');

    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('maintains selected items when data is updated', () => {
    const wrapper = mount({
      data() {
        return {
          items: [
            { key: 'no', label: 'Norge' },
            { key: 'sv', label: 'Sverige' },
            { key: 'en', label: 'England' },
          ],
          selected: [],
        };
      },
      template: `
      <div>
        <s-drop-down
          v-model="selected"
          :items="items"
          multiple
          label="Choose"
        />
      </div>`,
      components: { 's-drop-down': SDropDown },
    });

    wrapper.find('.s-input').trigger('click');
    wrapper.findAll('.s-list-item').trigger('click');

    // All are selected
    expect(wrapper.vm.$data.selected).toEqual([
      { key: 'no', label: 'Norge' },
      { key: 'sv', label: 'Sverige' },
      { key: 'en', label: 'England' },
    ]);

    // New data arrives
    wrapper.setData({
      items: [
        { key: 'no', label: 'Norway' },
        { key: 'dk', label: 'Denmark' },
      ],
    });

    // Items that remains present shall still be selected, with updated label
    expect(wrapper.vm.$data.selected).toEqual([
      { key: 'no', label: 'Norway' },
    ]);
  });

  it('maintains selected item when data is updated', () => {
    const wrapper = mount({
      data() {
        return {
          items: [
            { key: 'no', label: 'Norge' },
            { key: 'sv', label: 'Sverige' },
          ],
          selected: null,
        };
      },
      template: `
      <div>
        <s-drop-down
          v-model="selected"
          :items="items"
          label="Choose one"
        />
      </div>`,
      components: { 's-drop-down': SDropDown },
    });

    wrapper.find('.s-input').trigger('click');
    wrapper.find('.s-list-item').trigger('click');

    expect(wrapper.vm.$data.selected).toEqual(
      { key: 'no', label: 'Norge' },
    );

    // New data arrives
    wrapper.setData({
      items: [
        { key: 'no', label: 'Norway' },
        { key: 'dk', label: 'Denmark' },
      ],
    });

    // Item still selected, with updated label
    expect(wrapper.vm.$data.selected).toEqual(
      { key: 'no', label: 'Norway' },
    );
  });

  it('maintains selection when filtering', async () => {
    const wrapper = mount({
      data() {
        return {
          items: [
            { key: 'no', label: 'Norge' },
            { key: 'sv', label: 'Sverige' },
            { key: 'en', label: 'England' },
          ],
          selected: [],
        };
      },
      template: `
      <div>
        <s-drop-down
          v-model="selected"
          :items="items"
          multiple
          search label="Choose"
        />
      </div>`,
      components: { 's-drop-down': SDropDown },
    });

    // Open menu
    let input = wrapper.find('input');
    input.trigger('click');

    wrapper.find('.s-list-item').trigger('click');

    input.setValue('sve');

    // Still selected
    expect(wrapper.vm.$data.selected).toEqual([
      { key: 'no', label: 'Norge' },
    ]);
  });
});
