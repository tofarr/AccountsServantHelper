import Service from '@ember/service';
import { inject } from '@ember/service';
import moment from 'moment';
import RSVP from 'rsvp';

export default Service.extend({

  store: inject('store'),

  list(){
    return this.get('store').findAll('interest-payment');
  },

  newInstance(){
    return new RSVP.Promise((resolve) => {
      resolve({
        date: moment().format('YYYY-MM-DD'),
        value: 0
      });
    });
  },

  isValid(interestPayment){
    return interestPayment.date && (interestPayment.value > 0);
  },

  create(interestPayment){
    if(!this.isValid(interestPayment)){
      return new RSVP.Promise((resolve, reject) => {
        reject('Invalid Interest Payment');
      });
    }
    let record = this.get('store').createRecord('interest-payment', interestPayment);
    return record.save();
  },

  update(interestPayment){
    if(!this.isValid(interestPayment)){
      return new RSVP.Promise((resolve, reject) => {
        reject('Invalid Interest Payment');
      });
    }
    return interestPayment.save();
  },

  remove(record){
    record.deleteRecord();
    return record.save();
  },

  overview(startDate, endDate){
    return new RSVP.Promise((resolve, reject) => {
      this.list().then((interestPayments) => {
        var ret = {
          opening: 0,
          value: 0,
          closing: 0,
          results: []
        }
        interestPayments.forEach((interestPayment) => {
          let date = interestPayment.get('date');
          if(date < startDate){
            ret.opening += interestPayment.get('value');
          }else if(date < endDate){
            ret.value += interestPayment.get('value');
            ret.results.push(interestPayment)
          }
        });
        ret.results.sortBy('date');
        ret.closing = ret.opening + ret.value;
        resolve(ret);
      }, reject);
    });
  }
});
