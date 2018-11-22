import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import RSVP from 'rsvp';
import moment from 'moment';
import money from '../utils/money';

export default Route.extend({

  settings: inject('settings'),
  calculations: inject('calculations'),
  meetings: inject('meetings'),
  deposits: inject('deposits'),
  incomingTransfers: inject('incoming-transfers'),
  outgoingCheques: inject('outgoing-cheques'),
  interestPayments: inject('interest-payments'),
  wefts: inject('wefts'),

  queryParams: {
    month: {
      refreshModel: true,
      replace: false
    }
  },

  model(params){
    return new RSVP.Promise((resolve, reject) => {
      var month = moment(params.month, 'YYYY-MM').startOf('month');
      let startDate = month.format('YYYY-MM-DD');
      let endDate = moment(month).add(1, 'month').format('YYYY-MM-DD');
      RSVP.hash({
        month: month,
        settings: this.get('settings').read(),
        meetings: this.get('meetings').overview(startDate, endDate),
        deposits: this.get('deposits').overview(startDate, endDate),
        incomingTransfers: this.get('incomingTransfers').overview(startDate, endDate),
        outgoingCheques: this.get('outgoingCheques').overview(startDate, endDate),
        interestPayments: this.get('interestPayments').overview(startDate, endDate),
        wefts: this.get('wefts').overview(startDate, endDate),
        expectedMeetingDates: this.get('calculations').expectedMeetings(params.month)
      }).then((hash)=>{
        this.modelCallback(hash, resolve, reject);
      },reject);
    });
  },

  calculateWarnings(meetings, expectedMeetingDates, deposits, incomingTransfers, outgoingCheques, interestPayments, wefts){
    let warnings = [];
    this.addExpectedMeetingWarnings(meetings, expectedMeetingDates, warnings);
    this.addMeetingMatchDepositWarning(meetings, deposits, warnings);
    this.addOutgoingChequesWarning(outgoingCheques, warnings);
    this.addIncomingTransfersWarning(incomingTransfers, warnings);
    this.addInterestPaymentsWarning(interestPayments, warnings);
    this.addWeftsWarning(wefts, warnings);
    return warnings;
  },

  addExpectedMeetingWarnings(meetings, expectedMeetingDates, warnings){
    meetings.results.forEach((meeting) => {
      let date = meeting.get('date');
      let index = expectedMeetingDates.indexOf(date);
      if(index >= 0){
        expectedMeetingDates.splice(index, 1);
      }else{
        warnings.push('Unexpected meeting on '+date);
      }
    });
    expectedMeetingDates.forEach((date) => {
      warnings.push('Expected meeting on '+date);
    });
  },

  addMeetingMatchDepositWarning(meetings, deposits, warnings){
    if(meetings.total != deposits.total){
      warnings.push('Expected receipts ('+money(meetings.total)+') to match deposits ('+money(deposits.total)+')');
    }
  },

  addIncomingTransfersWarning(incomingTransfers, warnings){
    if(!incomingTransfers.results.length){
      warnings.push('Expected at least 1 incoming transfer');
    }
  },

  addOutgoingChequesWarning(outgoingCheques, warnings){
    if(!outgoingCheques.results.length){
      warnings.push('Expected at least 1 outgoing cheque');
    }
    outgoingCheques.results.forEach((outgoingCheque) => {
      if(!outgoingCheque.get('processedDate')){
        warnings.push('Unprocessed Cheque: '+outgoingCheque.get('chequeId')+' ('+outgoingCheque.get('issueDate')+') : '+money(outgoingCheque.get('value')));
      }
    });
  },

  addInterestPaymentsWarning(interestPayments, warnings){
    if(interestPayments.results.length != 1){
      warnings.push('Expected a single interest payment');
    }
  },

  addWeftsWarning(wefts, warnings){
    if(wefts.results.length != 1){
      warnings.push('Expected a single wefts transfer');
    }
  },

  dateStr(date){
    return date.substring(5,7) + date.substring(8);
  }
});
