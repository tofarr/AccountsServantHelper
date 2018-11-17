import Service from '@ember/service';
import { inject } from '@ember/service';
import moment from 'moment';
import RSVP from 'rsvp';

export default Service.extend({

  store: inject('store'),
  calculations: inject('calculations'),

  list(){
    return this.get('store').findAll('deposit');
  },

  newInstance(){
    return new RSVP.Promise((resolve, reject) => {
      this.get('calculations').recieptsBalance().then((balance) => {
        resolve({
          date: moment().format('YYYY-MM-DD'),
          forLastMeeting: balance.lastMeeting,
          cash: balance.cash,
          cheques: balance.cheques
        })
      }, reject);
    });
  },

  isValid(deposit){
    if (deposit.cash < 0 || deposit.cheques < 0){
      return false;
    }
    if(moment(deposit.date, 'YYYY-MM-DD').toDate().getTime() < moment(deposit.forLastMeeting, 'YYYY-MM-DD').toDate().getTime()){
      return false
    }
    return (deposit.cash || deposit.cheques);
  },

  create(deposit){
    if(!this.isValid(deposit)){
      return new RSVP.Promise((resolve, reject) => {
        reject('Invalid Deposit');
      });
    }
    let record = this.get('store').createRecord('deposit', deposit);
    return record.save();
  },

  remove(record){
    record.deleteRecord();
    return record.save();
  }
});
