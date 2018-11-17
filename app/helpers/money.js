import { helper } from '@ember/component/helper';
import m from '../utils/money';

export function money([value]) {
  return m(value);
}

export default helper(money);
