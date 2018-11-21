import moment from 'moment';
import RSVP from 'rsvp';
import crudService from '../utils/crud-service';

export default crudService('interest-payment').extend({

  newInstance(){
    return new RSVP.Promise((resolve) => {
      resolve({
        date: moment().format('YYYY-MM-DD'),
        value: 0
      });
    });
  },

  validate(interestPayment){
    var ret = [];
    if(!interestPayment.date){
      ret.push('Date is required');
    }
    if(!(interestPayment.value)){
      ret.push('Value must be greater than 0');
    }
    return ret;
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
