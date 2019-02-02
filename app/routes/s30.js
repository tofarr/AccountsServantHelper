import AbstractReportRoute from '../utils/abstract-report-route';
import moment from 'moment';

export default AbstractReportRoute.extend({

  modelCallback(hash, resolve){

    var localExpenditureItems = []; // operationsFund, khahc, gaa, coaa, ct
    hash.outgoingCheques.results.forEach((cheque) => {
      localExpenditureItems.push({title:cheque.get('notes'),value:cheque.get('value')});
    });
    localExpenditureItems.push(
      {title:'KHAHC',value:hash.wefts.khahc},
      {title:'GAA',value:hash.wefts.gaa},
      {title:'COAA',value:hash.wefts.coaa},
      {title:'CT',value:hash.wefts.ct}
    );


    var model = {
      monthParam: hash.month.format('YYYY-MM'),
      prevMonthParam: moment(hash.month).add(-1, 'month').format('YYYY-MM'),
      nextMonthParam: moment(hash.month).add(1, 'month').format('YYYY-MM'),
      congregation: hash.settings.congregation,
      accountsServantName: hash.settings.accountsServantName,
      month: hash.month.format('MMMM'),
      year: hash.month.year(),
      openingBalance: hash.settings.openingBalance + hash.settings.otherBalance + hash.deposits.totalOpening + hash.incomingTransfers.opening - hash.outgoingCheques.opening + hash.interestPayments.opening - hash.wefts.totalOpening,

      localIncomeItems: [
        {title: 'Congregation Contributions (Box)', value: hash.meetings.local},
        {title: 'Congregation Contributions (CE)', value: hash.incomingTransfers.value},
        {title: 'Interest', value: hash.interestPayments.value},
      ], // localReceipts interest
      localIncome: hash.meetings.local + hash.incomingTransfers.value + hash.interestPayments.value,

      localExpenditureItems: localExpenditureItems,
      localExpenditure: hash.outgoingCheques.value + hash.wefts.khahc + hash.wefts.gaa + hash.wefts.coaa + hash.wefts.ct,

      worldwide: hash.meetings.worldwide,

      monthBalance: 0,
      closingBalance: 0,

      income: 0,
      //wefts: 0 // worldwide wefts
      warnings: this.calculateWarnings(hash.meetings, hash.expectedMeetingDates, hash.deposits, hash.incomingTransfers, hash.outgoingCheques, hash.interestPayments, hash.wefts),

    };
    model.monthBalance = model.localIncome - model.localExpenditure;
    model.closingBalance = model.monthBalance + model.openingBalance;
    model.income = model.localIncome + model.worldwide;
    model.expenditure = model.localExpenditure + hash.wefts.worldwide;

    resolve(model);
  }
});
