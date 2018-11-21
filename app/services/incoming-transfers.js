import moment from 'moment';
import RSVP from 'rsvp';
import crudService from '../utils/crud-service';

export default crudService('incoming-transfer').extend({

  newInstance(){
    return new RSVP.Promise((resolve) => {
      resolve({
        date: moment().format('YYYY-MM-DD'),
        transferId: null,
        value: 0
      });
    });
  },

  validate(incomingTransfer){
    var ret = [];
    if(!incomingTransfer.date){
      ret.push('Date is required');
    }
    if(!(incomingTransfer.value)){
      ret.push('Value must be greater than 0');
    }
    return ret;
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
