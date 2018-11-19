import { mount } from '@vue/test-utils';
import UiButton from '@/components/UiButton.vue';

describe('UiButton', () => {
  it('renders normal button', () => {
    const wrapper = mount(UiButton, {
      slots: {
        default: 'Normal button',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders primary button', () => {
    const wrapper = mount(UiButton, {
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
    const wrapper = mount(UiButton, {
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
