import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import SDialog from '@/components/SDialog.vue';
import SIcon from '@/components/SIcon.vue';

const localVue = createLocalVue();
localVue.component('SIcon', SIcon);

describe('SDialog', () => {
  it('is hidden', () => {
    const wrapper = shallowMount(SDialog, {
      localVue,
      propsData: {
        visible: false,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('is visible', () => {
    const wrapper = shallowMount(SDialog, {
      localVue,
      propsData: {
        visible: true,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('displays heading', () => {
    const wrapper = shallowMount(SDialog, {
      localVue,
      propsData: {
        visible: true,
        heading: 'header',
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('displays slot content', () => {
    const wrapper = shallowMount(SDialog, {
      localVue,
      propsData: {
        visible: true,
      },
      scopedSlots: {
        default: '<button>OK</button>',
      },
    });

    expect(wrapper.contains('button')).toBeTruthy();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('closes on pressing SIcon', () => {
    const wrapper = mount(SDialog, {
      components: {
        SIcon,
      },
      propsData: {
        visible: true,
      },
    });

    let sIcon = wrapper.find('.sunshine24-close');
    sIcon.trigger('click');

    expect(wrapper.emitted('toggle')[0][0]).toEqual(false);
  });

  // test: 'closes on close button passed by slot'?
});
