import AbstractReportRoute from '../utils/abstract-report-route';

export default AbstractReportRoute.extend({

  modelCallback(hash, resolve){
    let model = {
      monthParam: hash.month.format('YYYY-MM'),
      month: hash.month.format('MMMM YYYY'),
      warnings: this.calculateWarnings(hash.meetings, hash.expectedMeetingDates, hash.deposits, hash.incomingTransfers, hash.outgoingCheques, hash.interestPayments, hash.wefts),
      openingBalance: hash.settings.openingBalance + hash.deposits.totalOpening + hash.incomingTransfers.opening - hash.outgoingCheques.opening + hash.interestPayments.opening - hash.wefts.totalOpening,
      notInOpeningTotal : hash.deposits.notInOpeningTotal - hash.outgoingCheques.notInOpeningTotal - hash.wefts.notInOpeningTotal,
      notInClosingTotal : hash.deposits.notInClosingTotal - hash.outgoingCheques.notInClosingTotal - hash.wefts.notInClosingTotal,
      notInOpening: this.calculateNotIn('notInOpening', hash.deposits, hash.outgoingCheques, hash.wefts),
      notInClosing: this.calculateNotIn('notInClosing', hash.deposits, hash.outgoingCheques, hash.wefts),
      checkingAccountIn: hash.deposits.total + hash.incomingTransfers.value + hash.interestPayments.value,
      checkingAccountOut: hash.outgoingCheques.value + hash.wefts.total
    };
    model.rows = this.calculateRows(hash.deposits, hash.outgoingCheques, hash.incomingTransfers, hash.interestPayments, hash.wefts, model.openingBalance);
    model.checkingAccountBalance = model.checkingAccountIn - model.checkingAccountOut;
    model.closingBalance = model.checkingAccountBalance + model.openingBalance;
    model.openingStatement = model.openingBalance - model.notInOpeningTotal;
    model.closingStatement = model.closingBalance - model.notInClosingTotal;
    model.monthBalance = model.closingBalance - model.openingBalance;
    model.monthStatement = model.closingStatement - model.openingStatement;
    resolve(model);
  },

  calculateNotIn(attr, deposits, outgoingCheques, wefts){
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
  },

  calculateRows(deposits, outgoingCheques, incomingTransfers, interestPayments, wefts, balance){
    let ret = [];
    deposits.results.forEach((deposit) => {
      ret.push({
        date: deposit.get('date'),
        description: 'Deposit',
        value: deposit.get('total')
      });
    });
    outgoingCheques.results.forEach((outgoingCheque) => {
      ret.push({
        date: outgoingCheque.get('issueDate'),
        description: 'Cheque ' + outgoingCheque.get('chequeId'),
        value: -outgoingCheque.get('value')
      });
    });
    incomingTransfers.results.forEach((incomingTransfer) => {
      ret.push({
        date: incomingTransfer.get('date'),
        description: 'Deposit CC ' + incomingTransfer.get('transferId'),
        value: incomingTransfer.get('value')
      });
    });
    interestPayments.results.forEach((interestPayment) => {
      ret.push({
        date: interestPayment.get('date'),
        description: 'Interest',
        value: interestPayment.get('value')
      });
    });
    wefts.results.forEach((weft) => {
      ret.push({
        date: weft.get('forLastMeeting'),
        description: 'WEFTS',
        value: -weft.get('total')
      });
    });
    ret = ret.sortBy('date');
    ret.forEach((row) => {
      balance += row.value;
      row.balance = balance;
    });
    return ret;
  }
});
