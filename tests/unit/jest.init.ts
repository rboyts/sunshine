import VueTestUtils from '@vue/test-utils';
import classHelper from '@/lib/classHelper';

VueTestUtils.config.mocks = {
  $class: classHelper,
};
