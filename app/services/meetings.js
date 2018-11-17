import Service from '@ember/service';
import { inject } from '@ember/service';
import moment from 'moment';
import RSVP from 'rsvp';

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

  isValid(meeting){
    if (meeting.cash < 0 || meeting.cheques < 0 || meeting.local < 0 || meeting.worldwide < 0){
      return false;
    }
    let count1 = meeting.cash + meeting.cheques;
    let count2 = meeting.local + meeting.worldwide;
    return meeting.date && count1 && (count1 == count2);
  },

  create(meeting){
    if(!this.isValid(meeting)){
      return new RSVP.Promise((resolve, reject) => {
        reject('Invalid Meeting');
      });
    }
    let record = this.get('store').createRecord('meeting', meeting);
    return record.save();
  },

  remove(record){
    record.deleteRecord();
    return record.save();
  }
});
