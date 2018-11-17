import Service from '@ember/service';
import { inject } from '@ember/service';
import Meeting from '../models/meeting';
import moment from 'moment';

export default Service.extend({

  store: inject('store'),

  list(){
    return this.get('store').findAll('meeting');
  },

  newInstance(){
    // Why oh Why is there no way to link this to the object in ember? Looks like I will be learning react soon.
    return {
      date: moment().format('YYYY-MM-DD'),
      local: 0,
      worldwide: 0,
      cash: 0,
      cheques: 0
    };
  },

  create(meeting){
    let record = this.get('store').createRecord('meeting', meeting);
    return record.save();
  },

  destroy(record){
    record.deleteRecord();
    return record.save();
  }
});
