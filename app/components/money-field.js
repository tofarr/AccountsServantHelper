import Component from '@ember/component';
import { computed } from '@ember/object';
import money from '../utils/money';

export default Component.extend({
  tagName: 'label',
  classNames: ['field', 'money-field'],
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  disabled: false,

  change(event){
    this.set('value', Math.round(parseFloat(event.target.value) * 100) || 0);
  },

  formattedValue: computed('value', function(){
    return money(this.get('value'));
  })
});
