import Vue from 'vue';
import { mount, config, Wrapper } from '@vue/test-utils';
import SFormatInput from '@/components/internal/SFormatInput.vue';

config.logModifiedComponents = false;

describe('SFormatInput', () => {
  let wrapper: Wrapper<Vue>;
  let inputEl: Wrapper<Vue>;

  beforeEach(() => {
    wrapper = mount({
      components: {
        SFormatInput,
      },
      data() {
        return {
          value: '',
          format: 'dd.mm.yyyy',
        };
      },
      template: `
        <s-format-input
          v-model="value"
          :format="format"
        />
      `,
    });
    inputEl = wrapper.find('input.s-format-input__input');
  });

  it.each`
    format          | input           | expected
    ${'dd.mm.yyyy'} | ${'1'}          | ${'1'}
    ${'dd.mm.yyyy'} | ${'12'}         | ${'12'}
    ${'dd.mm.yyyy'} | ${'123'}        | ${'12.3'}
    ${'dd.mm.yyyy'} | ${'1234'}       | ${'12.34'}
    ${'dd.mm.yyyy'} | ${'1.'}         | ${'01.'}
    ${'dd.mm.yyyy'} | ${'01.'}        | ${'01.'}
    ${'dd.mm.yyyy'} | ${'1.2.'}       | ${'01.02.'}
    ${'dd.mm.yyyy'} | ${'012.'}       | ${'01.02.'}
    ${'dd.mm.yyyy'} | ${'01.02.2019'} | ${'01.02.2019'}
    ${'dd.mm.yyyy'} | ${'01-02-2019'} | ${'01.02.2019'}
    ${'dd.mm.yyyy'} | ${'01022019'}   | ${'01.02.2019'}
    ${'dd.mm.yyyy'} | ${'1.2.2019'}   | ${'01.02.2019'}
    ${'00:00'}      | ${'1234'}       | ${'12:34'}
    ${'00:00'}      | ${'7:30'}       | ${'07:30'}
    ${'00:00'}      | ${'123456'}     | ${'12:34'}
  `('formats $input as $expected',
  ({ format, input, expected }) => {
    wrapper.setData({ format });
    inputEl.setValue(input);
    inputEl.trigger('input');

    expect(wrapper.vm.$data.value).toEqual(expected);
  });
});
