import crudController from '../utils/crud-controller';
import add from '../utils/add';
import { computed } from '@ember/object';
import moment from 'moment';

export default crudController('weft').extend({

  to62Total: add('to62.worldwideResolution', 'to62.khahc', 'to62.gaa', 'to62.coaa', 'to62.ct', 'to62.worldwide'),

  to62Year: computed('to62', function(){
    return moment(this.get('to62.date')).format('YYYY');
  }),

  to62Month: computed('to62', function(){
    return moment(this.get('to62.date')).format('MMM');
  }),

  to62Date: computed('to62', function(){
    return moment(this.get('to62.date')).format('DD');
  }),

  actions: {
    print(){
      if(window.tofarrCordovaPrint){
        window.tofarrCordovaPrint.doPrint();
      }else{
        window.print();
      }
    }
  }
})
