import { shallowMount } from '@vue/test-utils';
import SbaseInput from '@/components/SBaseInput.vue';

describe('SBaseInput', () => {
  it('doesnt show label if none is given', () => {
    const wrapper = shallowMount(SbaseInput);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows label if set', () => {
    const wrapper = shallowMount(SbaseInput, {
      propsData: {
        label: 'This is a lable',
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders content in slot', () => {
    const wrapper = shallowMount(SbaseInput, {
      slots: {
        default: 'Content',
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });


  it('label is big when input has no content', () => {
    const wrapper = shallowMount(SbaseInput, {
      propsData: {
        isEmpty: true,
        label: 'This is a lable',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('label is small when input has content', () => {
    const wrapper = shallowMount(SbaseInput, {
      propsData: {
        isEmpty: false,
        label: 'This is a lable',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('label is small when input has focus', () => {
    const wrapper = shallowMount(SbaseInput, {
      propsData: {
        hasFocus: true,
        label: 'This is a lable',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('label is small when input has content and focus', () => {
    const wrapper = shallowMount(SbaseInput, {
      propsData: {
        hasFocus: true,
        isEmpty: false,
        label: 'This is a lable',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
