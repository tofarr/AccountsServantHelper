import Service from '@ember/service';
import { inject } from '@ember/service';
import moment from 'moment';
import RSVP from 'rsvp';

export default Service.extend({

  store: inject('store'),

  list(){
    return this.get('store').findAll('incoming-transfer');
  },

  newInstance(){
    return new RSVP.Promise((resolve, reject) => {
      resolve({
        date: moment().format('YYYY-MM-DD'),
        transferId: null,
        value: 0
      });
    });
  },

  isValid(incomingTransfer){
    return incomingTransfer.date && (incomingTransfer.value > 0);
  },

  create(incomingTransfer){
    if(!this.isValid(incomingTransfer)){
      return new RSVP.Promise((resolve, reject) => {
        reject('Invalid Incoming Transfer');
      });
    }
    let record = this.get('store').createRecord('incoming-transfer', incomingTransfer);
    return record.save();
  },

  remove(record){
    record.deleteRecord();
    return record.save();
  },

  overview(startDate, endDate){
    return new RSVP.Promise((resolve, reject) => {
      this.list().then((transfers) => {
        var ret = {
          opening: 0,
          value: 0,
          closing: 0,
          results: []
        }
        transfers.forEach((transfer) => {
          let date = transfer.get('date');
          if(date < startDate){
            ret.opening += transfer.get('value');
          }else if(date < endDate){
            ret.value += transfer.get('value');
            ret.results.push(transfer)
          }
        });
        ret.results.sortBy('date');
        ret.closing = ret.opening + ret.value;
        resolve(ret);
      }, reject);
    });
  }
});