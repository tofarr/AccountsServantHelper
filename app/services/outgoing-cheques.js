import Service from '@ember/service';
import { inject } from '@ember/service';
import moment from 'moment';
import RSVP from 'rsvp';

export default Service.extend({

  store: inject('store'),
  settings: inject('settings'),

  list(){
    return this.get('store').findAll('outgoing-cheque');
  },

  newInstance(){
    return new RSVP.Promise((resolve, reject) => {
      this.get('settings').read().then((settings) => {
        resolve({
          issueDate: moment().format('YYYY-MM-DD'),
          processedDate: null, // Unknown at first
          chequeId: null,
          value: settings.get('defaultOutgoingChequeAmt'),
          notes: null
        });
      }, reject);
    });
  },

  isValid(outgoingCheque){
    let processedDate = Ember.get(outgoingCheque, 'processedDate');
    let issueDate = Ember.get(outgoingCheque, 'issueDate');
    if(!(Ember.get(outgoingCheque, 'value') > 0) || (!issueDate) || (!Ember.get(outgoingCheque,'chequeId'))) {
      return false;
    }
    if((processedDate) && (processedDate < issueDate)){
      return false;
    }
    return true;
  },

  create(outgoingCheque){
    if(!this.isValid(outgoingCheque)){
      return new RSVP.Promise((resolve, reject) => {
        reject('Invalid Outgoing Cheque');
      });
    }
    let record = this.get('store').createRecord('outgoing-cheque', outgoingCheque);
    return record.save();
  },

  update(outgoingCheque){
    if(!this.isValid(outgoingCheque)){
      return new RSVP.Promise((resolve, reject) => {
        reject('Invalid Outgoing Cheque');
      });
    }
    return outgoingCheque.save();
  },

  remove(record){
    record.deleteRecord();
    return record.save();
  }
});
