import { mount } from '@vue/test-utils';
import STextField from '@/components/STextField.vue';

describe('STextField', () => {
  it('renders empty text field', () => {
    const wrapper = mount(STextField, {
      propsData: {
        label: 'Text field',
        value: '',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders text field with text', () => {
    const wrapper = mount(STextField, {
      propsData: {
        label: 'Text field',
        value: 'foobar',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('emits entered value', () => {
    const wrapper = mount(STextField, {
      propsData: {
        label: 'Text field',
        value: '',
      },
    });
    let input = wrapper.findAll('input');
    input.setValue('kokobaba');
    input.trigger('change');

    expect(wrapper.emitted('input')[0]).toEqual(['kokobaba']);
  });
});
