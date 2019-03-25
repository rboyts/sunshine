import { mount } from '@vue/test-utils';
import STextArea from '@/components/STextArea.vue';

describe('STextArea', () => {
  it('renders empty text field', () => {
    const wrapper = mount(STextArea, {
      propsData: {
        label: 'Text Area',
        value: '',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders text field with text', () => {
    const wrapper = mount(STextArea, {
      propsData: {
        label: 'Text Area',
        value: 'foobar',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('doesnt change value when read only', () => {
    const wrapper = mount(STextArea, {
      propsData: {
        label: 'Text Area',
        value: '',
        readonly: true,
      },
    });
    const textarea = wrapper.find('textarea');
    textarea.setValue('omg');
    textarea.trigger('change');

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('doesnt change value when inactive', () => {
    const wrapper = mount(STextArea, {
      propsData: {
        label: 'Text Area',
        value: '',
        inactive: true,
      },
    });
    const textarea = wrapper.find('textarea');
    textarea.setValue('omg');
    textarea.trigger('change');

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('emits entered value', () => {
    const wrapper = mount(STextArea, {
      propsData: {
        label: 'Text Area',
        value: '',
      },
    });
    const textarea = wrapper.find('textarea');
    textarea.setValue('omg');
    textarea.trigger('change');

    expect(wrapper.emitted('input')[0]).toEqual(['omg']);
  });
});
