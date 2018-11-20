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
    setValueDate(value){
      this.set('value', value ? moment(value).format('YYYY-MM-DD') : null);
    }
  }
});
