import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['field', 'number-field'],
  min: -100000000,
  max: 100000000,

  change(event){
    this.set('value', parseInt(parseFloat(arguments[0].target.value) * 100));
  },

  formattedValue: computed('value', function(){
    return (this.get('value') / 100).toFixed(2);
  })
});
