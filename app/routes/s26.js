import money from '../utils/money';
import AbstractReportRoute from '../utils/abstract-report-route';

export default AbstractReportRoute.extend({

  modelCallback(hash, resolve){
    let model = {
      monthParam: hash.month.format('YYYY-MM'),
      month: hash.month.format('MMMM'),
      year: hash.month.year(),
      monthEnding: hash.month.endOf('month').format('MMMM DD YYYY'),
      congregation: hash.settings.congregation,
      city: hash.settings.city,
      state: hash.settings.state,
      openingBalance: hash.settings.openingBalance + hash.deposits.totalOpening + hash.incomingTransfers.opening - hash.outgoingCheques.opening + hash.interestPayments.opening - hash.wefts.totalOpening,
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
    model.totalAtEndOfMonth = model.closingAccountBalance + model.otherBalance;
    resolve(model);
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
      if(meeting.get('cancellation')){
        rows.push({
          date: this.dateStr(meeting.get('date')),
          description: meeting.get('cancellation')
        });
      }else{
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
      }
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
  }
});
