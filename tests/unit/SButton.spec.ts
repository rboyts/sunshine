import { mount } from '@vue/test-utils';
import SButton from '@/components/SButton.vue';

describe('SButton', () => {
  it('renders normal button', () => {
    const wrapper = mount(SButton, {
      slots: {
        default: 'Normal button',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders primary button', () => {
    const wrapper = mount(SButton, {
      propsData: {
        primary: true,
      },
      slots: {
        default: 'Primary button',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders small button', () => {
    const wrapper = mount(SButton, {
      propsData: {
        small: true,
      },
      slots: {
        default: 'Small button',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
