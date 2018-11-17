import { helper } from '@ember/component/helper';

export function money([value]) {
  return (value / 100).toFixed(2);
}

export default helper(money);
