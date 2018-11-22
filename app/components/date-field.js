import Component from '@ember/component';
import moment from 'moment';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'label',
  classNames: ['field', 'date-field'],
  title: 'Date',
  disabled: false,

  valueDate: computed('value', function(){
    return moment(this.get('value')).toDate();
  }),

  actions: {
    valueChanged(event){
      let value = event.target.value;
      let sanitized = moment(value, 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.set('value', (sanitized == value) ? value : null);
    },

    valueDateChanged(value){
      this.setProperties({
        value: value ? moment(value).format('YYYY-MM-DD') : null,
        showPika: false
      });
    }
  }
});
