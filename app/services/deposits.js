import { inject } from '@ember/service';
import moment from 'moment';
import RSVP from 'rsvp';
import { get } from '@ember/object';
import crudService from '../utils/crud-service';

export default crudService('deposit').extend({

  calculations: inject('calculations'),

  newInstance(){
    return new RSVP.Promise((resolve, reject) => {
      this.get('calculations').recieptsBalance().then((balance) => {
        resolve({
          date: moment().format('YYYY-MM-DD'),
          forLastMeeting: balance.lastMeeting,
          cash: Math.max(0, balance.cash),
          cheques: Math.max(0, balance.cheques)
        })
      }, reject);
    });
  },

  validate(deposit){
    var ret = [];
    let cash = get(deposit,'cash');
    let cheques = get(deposit,'cash');
    if (cash < 0 || cheques < 0){
      ret.push("Cash and Cheques must both be greater than or equal to 0.");
    }
    if(moment(get(deposit,'date'), 'YYYY-MM-DD').toDate().getTime() < moment(get(deposit,'forLastMeeting'), 'YYYY-MM-DD').toDate().getTime()){
      ret.push("Deposit date must be the same as or later than date of last meeting")
    }
    if(!(cash || cheques)){
      ret.push("A Cash or Cheque value is required")
    }
    return ret;
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
          results: [],
          notInOpening: [],
          notInOpeningTotal: 0,
          notInClosing: [],
          notInClosingTotal: 0
        }
        deposits.forEach((deposit) => {
          let date = deposit.get('date');
          let forLastMeeting = deposit.get('forLastMeeting');
          if(forLastMeeting < startDate){
            ret.cashOpening += deposit.get('cash');
            ret.chequesOpening += deposit.get('cheques');
            if(date >= startDate && date < endDate){
              ret.notInOpening.push(deposit);
              ret.notInOpeningTotal += deposit.get('total');
            }
          }else if(forLastMeeting < endDate){
            ret.cash += deposit.get('cash');
            ret.cheques += deposit.get('cheques');
            ret.results.push(deposit);
            if(date > endDate){
              ret.notInClosing.push(deposit);
              ret.notInClosingTotal += deposit.get('total');
            }
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
