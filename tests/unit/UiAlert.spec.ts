import { mount } from '@vue/test-utils';
import UiAlert from '@/components/UiAlert.vue';

describe('UiAlert', () => {
  it('renders successful alert', () => {
    const wrapper = mount(UiAlert, {
      propsData: { success: true },
      slots: {
        default: 'Success message',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders warning alert', () => {
    const wrapper = mount(UiAlert, {
      propsData: { warning: true },
      slots: {
        default: 'Warning message',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders error alert', () => {
    const wrapper = mount(UiAlert, {
      propsData: { error: true },
      slots: {
        default: 'Error message',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders button', () => {
    const wrapper = mount(UiAlert, {
      propsData: { warning: true },
      stubs: ['ui-button'],
      slots: {
        default: 'Warning message',
        buttons: `
          <ui-button small>Foo</ui-button>
        `,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
