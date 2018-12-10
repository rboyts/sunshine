import { mount } from '@vue/test-utils';
import SAlert from '@/components/SAlert.vue';

describe('SAlert', () => {
  it('renders successful alert', () => {
    const wrapper = mount(SAlert, {
      propsData: { success: true },
      slots: {
        default: 'Success message',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders warning alert', () => {
    const wrapper = mount(SAlert, {
      propsData: { warning: true },
      slots: {
        default: 'Warning message',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders error alert', () => {
    const wrapper = mount(SAlert, {
      propsData: { error: true },
      slots: {
        default: 'Error message',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders button', () => {
    const wrapper = mount(SAlert, {
      propsData: { warning: true },
      stubs: ['s-button'],
      slots: {
        default: 'Warning message',
        buttons: `
          <s-button small>Foo</s-button>
        `,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
