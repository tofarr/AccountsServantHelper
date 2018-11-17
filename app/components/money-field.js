import Component from '@ember/component';
import { computed } from '@ember/object';
import money from '../utils/money';

export default Component.extend({
  tagName: 'label',
  classNames: ['field', 'money-field'],
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,

  change(event){
    this.set('value', parseInt(parseFloat(arguments[0].target.value) * 100));
  },

  formattedValue: computed('value', function(){
    return money(this.get('value'));
  })
});
