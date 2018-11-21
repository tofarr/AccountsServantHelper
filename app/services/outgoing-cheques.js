import { inject } from '@ember/service';
import moment from 'moment';
import RSVP from 'rsvp';
import { get } from '@ember/object';
import crudService from '../utils/crud-service';

export default crudService('outgoing-cheque').extend({

  store: inject('store'),
  settings: inject('settings'),

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

  validate(outgoingCheque){
    var ret = [];
    let processedDate = get(outgoingCheque, 'processedDate');
    let issueDate = get(outgoingCheque, 'issueDate');
    if(!(get(outgoingCheque, 'value') > 0)){
      ret.push('Value must be greater than 0');
    }
    if(!issueDate){
      ret.push('Issue Date must not be blank');
    }else if((processedDate) && (processedDate < issueDate)){
      ret.push('Processed Date should be the same as or later than Issue Date! (How can you cash a cheque before it is written?)');
    }
    if(!get(outgoingCheque, 'chequeId')){
      ret.push('Cheque Id is required!');
    }
    if(!get(outgoingCheque, 'notes')){
      ret.push('Notes are required! (What was this cheque for?)');
    }
    return ret;
  },

  overview(startDate, endDate){
    return new RSVP.Promise((resolve, reject) => {
      this.list().then((outgoingCheques) => {
        var ret = {
          opening: 0,
          value: 0,
          closing: 0,
          results: []
        }
        outgoingCheques.forEach((outgoingCheque) => {
          let date = outgoingCheque.get('issueDate');
          if(date < startDate){
            ret.opening += outgoingCheque.get('value');
          }else if(date < endDate){
            ret.value += outgoingCheque.get('value');
            ret.results.push(outgoingCheque)
          }
        });
        ret.results.sortBy('issueDate');
        ret.closing = ret.opening + ret.value;
        resolve(ret);
      }, reject);
    });
  }
});
