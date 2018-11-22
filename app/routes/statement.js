import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import RSVP from 'rsvp';
import moment from 'moment';
import money from '../utils/money';
import AbstractReportRoute from '../utils/abstract-report-route';

export default AbstractReportRoute.extend({

  modelCallback(hash, resolve, reject){

    let model = {
      month: hash.month.format('MMMM YYYY'),
      warnings: this.calculateWarnings(hash.meetings, hash.expectedMeetingDates, hash.deposits, hash.incomingTransfers, hash.outgoingCheques, hash.interestPayments, hash.wefts),
      openingBalance: hash.settings.openingBalance + hash.deposits.totalOpening + hash.incomingTransfers.opening - hash.outgoingCheques.opening + hash.interestPayments.opening + hash.wefts.totalOpening,
      notInOpeningTotal : hash.deposits.notInOpeningTotal - hash.outgoingCheques.notInOpeningTotal - hash.wefts.notInOpeningTotal,
      notInClosingTotal : hash.deposits.notInClosingTotal - hash.outgoingCheques.notInClosingTotal - hash.wefts.notInClosingTotal,
      notInOpening: this.calculateRows('notInOpening', hash.deposits, hash.outgoingCheques, hash.wefts),
      notInClosing: this.calculateRows('notInClosing', hash.deposits, hash.outgoingCheques, hash.wefts),
      checkingAccountIn: hash.deposits.total + hash.incomingTransfers.value + hash.interestPayments.value,
      checkingAccountOut: hash.outgoingCheques.value + hash.wefts.total
    };
    model.checkingAccountBalance = model.checkingAccountIn - model.checkingAccountOut;
    model.closingBalance = model.checkingAccountBalance + model.openingBalance;
    model.openingStatement = model.openingBalance - model.notInOpeningTotal;
    model.closingStatement = model.closingBalance - model.notInClosingTotal;
    resolve(model);
  },

  calculateRows(attr, deposits, outgoingCheques, wefts){
    var ret = [];
    deposits[attr].forEach((deposit) => {
      ret.push({
        type: 'Deposit',
        date: deposit.get('forLastMeeting'),
        statementDate: deposit.get('date'),
        value: deposit.get('total')
      })
    });
    outgoingCheques[attr].forEach((outgoingCheque) => {
      ret.push({
        type: 'Cheque '+outgoingCheque.get('chequeId'),
        date: outgoingCheque.get('issueDate'),
        statementDate: outgoingCheque.get('processedDate'),
        value: -outgoingCheque.get('value')
      });
    });
    wefts[attr].forEach((weft) => {
      ret.push({
        type: 'WEFTS',
        date: weft.get('forLastMeeting'),
        statementDate: weft.get('date'),
        value: -weft.get('total')
      });
    });
    return ret;
  }
});
