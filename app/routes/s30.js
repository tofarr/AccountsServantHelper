import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import RSVP from 'rsvp';
import moment from 'moment';

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
      }).then((hash)=>{

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
          congregation: hash.settings.congregation,
          accountsServantName: hash.settings.accountsServantName,
          month: month.format('MMMM'),
          year: month.year(),
          openingBalance: hash.settings.openingBalance + hash.deposits.totalOpening + hash.incomingTransfers.opening - hash.outgoingCheques.opening + hash.interestPayments.opening + hash.wefts.totalOpening,

          localIncomeItems: [
            {title: 'Congregation Contributions', value: hash.meetings.local},
            {title: 'Interest', value: hash.interestPayments.value},
          ], // localReceipts interest
          localIncome: hash.meetings.local + hash.interestPayments.value,

          localExpenditureItems: localExpenditureItems,
          localExpenditure: hash.outgoingCheques.value + hash.wefts.khahc + hash.wefts.gaa + hash.wefts.coaa + hash.wefts.ct,

          worldwide: hash.meetings.worldwide,

          monthBalance: 0,
          closingBalance: 0,

          income: 0
          //wefts: 0 // worldwide wefts
        };
        model.monthBalance = model.localIncome - model.localExpenditure;
        model.closingBalance = model.monthBalance + model.openingBalance;
        model.income = model.localIncome + model.worldwide;
        model.expenditure = model.localExpenditure + hash.wefts.worldwide;

        resolve(model);
      }, reject);
    });
  },

  dateStr(date){
    return date.substring(5,7) + date.substring(8);
  },

  monthStr(date){
    return date.substring(0, 7);
  }

});
