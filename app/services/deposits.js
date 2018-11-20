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
    let cash = Ember.get(deposit,'cash');
    let cheques = Ember.get(deposit,'cash');
    if (cash < 0 || cheques < 0){
      return false;
    }
    if(moment(Ember.get(deposit,'date'), 'YYYY-MM-DD').toDate().getTime() < moment(Ember.get(deposit,'forLastMeeting'), 'YYYY-MM-DD').toDate().getTime()){
      return false
    }
    return (cash || cheques);
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
  },

  overview(startDate, endDate){
    return new RSVP.Promise((resolve, reject) => {
      this.list().then((deposits) => {
        var ret = {
          cashOpening: 0,
          cash: 0,
          cashClosing: 0,
          chequesOpening: 0,
          cheques: 0,
          chequesClosing: 0,
          totalOpening: 0,
          total: 0,
          totalClosing: 0,
          results: []
        }
        deposits.forEach((deposit) => {
          let date = deposit.get('forLastMeeting');
          if(date < startDate){
            ret.cashOpening += deposit.get('cash');
            ret.chequesOpening += deposit.get('cheques');
          }else if(date < endDate){
            ret.cash += deposit.get('cash');
            ret.cheques += deposit.get('cheques');
            ret.results.push(deposit)
          }
        });
        ret.results.sortBy('forLastMeeting');
        ret.cashClosing = ret.cashOpening + ret.cash;
        ret.chequesClosing = ret.chequesOpening + ret.cheques;
        ret.totalOpening = ret.cashOpening + ret.chequesOpening;
        ret.total = ret.cash + ret.cheques;
        ret.totalClosing = ret.cashClosing + ret.chequesClosing;
        resolve(ret);
      }, reject);
    });
  }
});
