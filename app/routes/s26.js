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
        settings: this.get('settings').read(),
        meetings: this.get('meetings').overview(startDate, endDate),
        deposits: this.get('deposits').overview(startDate, endDate),
        incomingTransfers: this.get('incomingTransfers').overview(startDate, endDate),
        outgoingCheques: this.get('outgoingCheques').overview(startDate, endDate),
        interestPayments: this.get('interestPayments').overview(startDate, endDate),
        wefts: this.get('wefts').overview(startDate, endDate),
        expectedMeetingDates: this.get('calculations').expectedMeetings(params.month)
      }).then((hash)=>{
        let model = {
          month: month.format('MMMM'),
          year: month.year(),
          monthEnding: month.endOf('month').format('MMMM DD YYYY'),
          congregation: hash.settings.congregation,
          city: hash.settings.city,
          state: hash.settings.state,
          openingBalance: hash.settings.openingBalance + hash.deposits.totalOpening + hash.incomingTransfers.opening - hash.outgoingCheques.opening + hash.interestPayments.opening + hash.wefts.totalOpening,
          otherBalance: hash.settings.otherBalance,
          receiptsIn: hash.meetings.total,
          receiptsOut: hash.deposits.total,
          receiptsBalance: 0,
          checkingAccountIn: hash.deposits.total + hash.incomingTransfers.value + hash.interestPayments.value,
          checkingAccountOut: hash.outgoingCheques.value + hash.wefts.total,
          checkingAccountBalance: 0,
          rows: this.calculateRows(hash.meetings, hash.deposits, hash.incomingTransfers, hash.outgoingCheques, hash.interestPayments, hash.wefts),
          warnings: this.calculateWarnings(hash.meetings, hash.expectedMeetingDates, hash.deposits, hash.incomingTransfers, hash.outgoingCheques, hash.interestPayments, hash.wefts)
        };
        model.receiptsBalance = model.receiptsIn - model.receiptsOut;
        model.checkingAccountBalance = model.checkingAccountIn - model.checkingAccountOut;
        model.closingAccountBalance = model.checkingAccountBalance + model.openingBalance;
        resolve(model);
      },reject);
    });
  },

  calculateRows(meetings, deposits, incomingTransfers, outgoingCheques, interestPayments, wefts){
    var rows = [];
    this.addMeetingRows(meetings, rows);
    this.addDepositRows(deposits, rows);
    this.addIncomingTransferRows(incomingTransfers, rows);
    this.addOutgoingChequeRows(outgoingCheques, rows);
    this.addInterestPaymentRows(interestPayments, rows);
    rows.sort((a, b) => {return a.date - b.date;}); // sort before wefts - wefts should be at end
    this.addWeftsRows(wefts, rows);
    var index = 0;
    rows.forEach((row) => {
      row.index = index;
      index += 1 + (row.subRows ? row.subRows.length : 0);
    });
    return rows;
  },

  addMeetingRows(meetings, rows){
    meetings.results.forEach((meeting) => {
      rows.push({
        date: this.dateStr(meeting.get('date')),
        description: 'Contributions - WW',
        tc: 'W',
        receiptsIn: meeting.get('worldwide')
      },{
        date: this.dateStr(meeting.get('date')),
        description: 'Contributions - Congregation',
        tc: 'C',
        receiptsIn: meeting.get('local')
      });
    });
  },

  addDepositRows(deposits, rows){
    deposits.results.forEach((deposit) => {
      rows.push({
        date: this.dateStr(deposit.get('date')),
        description: 'Deposit to checking account',
        tc: 'D',
        receiptsOut: deposit.get('total'),
        checkingAccountIn: deposit.get('total')
      });
    });
  },

  addIncomingTransferRows(incomingTransfers, rows){
    incomingTransfers.results.forEach((incomingTransfer) => {
      rows.push({
        date: this.dateStr(incomingTransfer.get('date')),
        description: 'Contributions Congregation Electronic (CongCredit)',
        tc: 'CC',
        checkingAccountIn: incomingTransfer.get('value')
      });
    });
  },

  addOutgoingChequeRows(outgoingCheques, rows){
    outgoingCheques.results.forEach((outgoingCheque) => {
      var description = 'Check '+outgoingCheque.get('chequeId');
      if(outgoingCheque.get('notes')){
        description += ' (' + outgoingCheque.get('notes') + ')';
      }
      rows.push({
        date: this.dateStr(outgoingCheque.get('issueDate')),
        description: description,
        tc: 'E',
        checkingAccountOut: outgoingCheque.get('value')
      });
    });
  },

  addInterestPaymentRows(interestPayments, rows){
    interestPayments.results.forEach((interestPayment) => {
      rows.push({
        date: this.dateStr(interestPayment.get('date')),
        description: 'Interest',
        tc: 'I',
        checkingAccountIn: interestPayment.get('value')
      });
    });
  },

  addWeftsRows(wefts, rows){
    wefts.results.forEach((weft) => {
      rows.push({
        date: this.dateStr(weft.get('date')),
        description: 'WEFTS ('+weft.get('transferId')+')',
        checkingAccountOut: weft.get('total'),
        subRows: [
          'Contributions - WW ' + money(weft.get('worldwide')),
          'KHAHC ' + money(weft.get('khahc')),
          'GAA ' + money(weft.get('gaa')),
          'COAA ' + money(weft.get('coaa')),
          'CT ' + money(weft.get('ct')),
        ]
      });
    });
  },

  calculateWarnings(meetings, expectedMeetingDates, deposits, incomingTransfers, outgoingCheques, interestPayments, wefts){
    let warnings = [];
    this.addExpectedMeetingWarnings(meetings, expectedMeetingDates, warnings);
    this.addMeetingMatchDepositWarning(meetings, deposits, warnings);
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
      warnings.push('Expected receipts ('+meetings.total+') to match deposits ('+deposits.total+')');
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
