import Service from '@ember/service';
import { inject } from '@ember/service';
import moment from 'moment';
import RSVP from 'rsvp';
import { get } from '@ember/object';

export default Service.extend({

  store: inject('store'),

  list(){
    return this.get('store').findAll('meeting');
  },

  newInstance(){
    // Why oh Why is there no way to link this to the object in ember? Looks like I will be learning react soon.
    return {
      date: moment().format('YYYY-MM-DD'),
      local: null,
      worldwide: null,
      cash: null,
      cheques: null
    };
  },

  isValid(meeting){
    let cash = get(meeting, 'cash');
    let cheques = get(meeting, 'cheques');
    let local = get(meeting, 'local');
    let worldwide = get(meeting, 'worldwide');
    if (cash < 0 || cheques < 0 || local < 0 || worldwide < 0){
      return false;
    }
    let count1 = cash + cheques;
    let count2 = local + worldwide;
    return get(meeting, 'date') && count1 && (count1 == count2);
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
  },

  overview(startDate, endDate){
    return new RSVP.Promise((resolve, reject) => {
      this.list().then((meetings) => {
        var ret = {
          localOpening: 0,
          local: 0,
          localClosing: 0,
          worldwideOpening: 0,
          worldwide: 0,
          worldwideClosing: 0,
          totalOpening: 0,
          total: 0,
          totalClosing: 0,
          results: []
        }
        meetings.forEach((meeting) => {
          let date = meeting.get('date');
          if(date < startDate){
            ret.localOpening += meeting.get('local');
            ret.worldwideOpening += meeting.get('worldwide');
          }else if(date < endDate){
            ret.local += meeting.get('local');
            ret.worldwide += meeting.get('worldwide');
            ret.results.push(meeting)
          }
        });
        ret.results.sortBy('date');
        ret.localClosing = ret.localOpening + ret.local;
        ret.worldwideClosing = ret.worldwideOpening + ret.worldwide;
        ret.totalOpening = ret.localOpening + ret.worldwideOpening;
        ret.total = ret.local + ret.worldwide;
        ret.totalClosing = ret.localClosing + ret.worldwideClosing;
        resolve(ret);
      }, reject);
    });
  }
});
