import Component from '@ember/component';
import moment from 'moment';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['field', 'date-field'],
  title: 'Date',

  valueDate: computed('value', function(){
    return moment(this.get('value')).toDate();
  }),

  actions: {
    setValueDate(value){
      this.set('value', moment(value).format('YYYY-MM-DD'));
    }
  }
});
