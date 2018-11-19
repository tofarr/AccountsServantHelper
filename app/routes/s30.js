import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import RSVP from 'rsvp';
import moment from 'moment';
import add from '../utils/add';
import { computed } from '@ember/object';

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

        //this.addParamsToModel(params, model);
        ///this.addSettingsToModel(hash.settings, model);
        /*
        this.addMeetingsToModel(hash.meetings, hash.settings, model);
        this.addDepositsToModel(hash.deposits, model);
        this.addIncomingTransfersToModel(hash.incomingTransfers, model);
        this.addOutgoingChequesToModel(hash.outgoingCheques, model);
        this.addInterestPaymentsToModel(hash.interestPayments, model);
        this.calculateBalances(model);
        this.addWEFTSToModel(hash.wefts, model);
        */

        /*
        model = Ember.Object.create(model);
        model.reopen({
          localExpenditure: computed('localExpenditure', function(){
            var ret = 0;
            this.get('localExpenditures').forEach((expenditure) => {
              ret += expenditure.value;
            });
            return ret;
          }),
          income: add('localIncome', 'worldwide'),
          expenditure: add('localExpenditure', 'wefts'),
          monthBalance: computed('income','expenditure',function(){
            return this.get('income') - this.get('expenditure');
          }),
          closingBalance: add('openingBalance', 'monthBalance')
        });
        */

        resolve(model);
      }, reject);
    });

    //Get opening balance

      //Get ordered list of meetings, deposits, incoming transfers, and outgoing cheques.

    //Generate warnings for this data.

      //Has there been 1 wefts transfer? (What if there were more than one?)
      //Has there been an operations cheque
      //Has there been a midweek meeting each week?
      //Has there been a sunday meeting each week?
      //Is there any additional unknown meetings?
      //Has there been an incoming transfer?
      //Has there been at least 1 outgoing cheque?
  },



  addParamsToModel(params, model){
    let month = moment(params.month, 'YYYY-MM');
    model.monthStr = params.month;
    model.month = month.format('MMMM');
    model.year = month.year();
  },

  addSettingsToModel(settings, model){
    model.congregation = settings.congregation;
    model.accountsServantName = settings.accountsServantName;
    model.openingBalance += settings.openingBalance;
    model.openingBalance += settings.otherBalance;
  },

  addMeetingsToModel(meetings, settings, model){
/*
    meetings.forEach((meeting) => {
      let date = meeting.get('date');
      if(this.monthStr(date) == model.monthStr){


        let dateStr = date.substring(5,7)+date.substring(8);
        model.rows.push({
          date: dateStr,
          description: 'Contributions - WW',
          tc: 'W',
          receiptsIn: meeting.get('worldwide')
        },{
          date: dateStr,
          description: 'Contributions - Congregation',
          tc: 'C',
          receiptsIn: meeting.get('local')
        });
      }
      let index = expectedMeetingDates.indexOf(date);
      if(index >= 0){
        expectedMeetingDates.splice(index, 1);
      }else{
        model.warnings.push('Unexpected meeting on '+date);
      }
      model.receiptsIn += meeting.get('total');
    });

    expectedMeetingDates.forEach((date) => {
      model.warnings.push('Expected meeting on '+date);
    });
*/
  },

  addDepositsToModel(deposits, model){
    var numDeposits = 0;
    deposits.forEach((deposit) => {
      let date = deposit.get('date');
      let monthStr = this.monthStr(date);
      if(monthStr < model.monthStr){
        model.openingBalance += deposit.get('total');
      }else if(monthStr == model.monthStr){
        model.rows.push({
          date: this.dateStr(date),
          description: 'Deposit to checking account',
          tc: 'D',
          receiptsOut: deposit.get('total'),
          checkingAccountIn: deposit.get('total')
        });
        numDeposits++;
        model.receiptsOut += deposit.get('total');
        model.checkingAccountIn += deposit.get('total');
      }
    });
    if(!numDeposits){
      model.warnings.push('Expected at least 1 deposit');
    }
  },

  addIncomingTransfersToModel(incomingTransfers, model){
    var numIncomingTransfers = 0;
    incomingTransfers.forEach((incomingTransfer) => {
      let date = incomingTransfer.get('date');
      let monthStr = this.monthStr(date);
      if(monthStr < model.monthStr){
        model.openingBalance += incomingTransfer.get('value');
      }else if(monthStr == model.monthStr){
        model.rows.push({
          date: this.dateStr(date),
          description: 'Contributions Congregation Electronic (CongCredit)',
          tc: 'CC',
          checkingAccountIn: incomingTransfer.get('value')
        });
        numIncomingTransfers++;
        model.checkingAccountIn += incomingTransfer.get('value');
      }
    });
    if(!numIncomingTransfers){
      model.warnings.push('Expected at least 1 incoming transfer');
    }
  },

  addOutgoingChequesToModel(outgoingCheques, model){
    var numOutgoingCheques = 0;
    outgoingCheques.forEach((outgoingCheque) => {
      let date = outgoingCheque.get('issueDate');
      let monthStr = this.monthStr(date);
      if(monthStr < model.monthStr){
        model.openingBalance += outgoingCheque.get('value');
      }else if(monthStr == model.monthStr){
        var description = 'Check '+outgoingCheque.get('chequeId');
        if(outgoingCheque.get('notes')){
          description += ' (' + outgoingCheque.get('notes') + ')';
        }
        model.rows.push({
          date: this.dateStr(date),
          description: description,
          tc: 'E',
          checkingAccountOut: outgoingCheque.get('value')
        });
        numOutgoingCheques++;
        model.checkingAccountOut += outgoingCheque.get('value');
      }
    });
    if(!numOutgoingCheques){
      model.warnings.push('Expected at least 1 outgoing cheque');
    }
  },

  addInterestPaymentsToModel(interestPayments, model){
    var numInterestPayments = 0;
    interestPayments.forEach((interestPayment) => {
      let date = interestPayment.get('date');
      let monthStr = this.monthStr(date);
      if(monthStr < model.monthStr){
        model.openingBalance += interestPayment.get('value');
      }else if(monthStr == model.monthStr){
        model.rows.push({
          date: this.dateStr(date),
          description: 'Interest',
          tc: 'I',
          checkingAccountIn: interestPayment.get('value')
        });
        numInterestPayments++;
        model.checkingAccountIn += interestPayment.get('value');
      }
    });
    if(numInterestPayments != 1){
      model.warnings.push('Found '+numInterestPayments+' interest payments - expected 1');
    }
  },

  addWEFTSToModel(wefts, model){
    var numWeftsTransfers = 0;
    wefts.forEach((weft) => {
      let date = weft.get('date');
      let monthStr = this.monthStr(date);
      if(monthStr < model.monthStr){
        model.openingBalance -= weft.get('total');
      }else if(monthStr == model.monthStr){
        model.rows.push({
          date: this.dateStr(date),
          description: 'WEFTS ('+weft.get('transferId')+')',
          checkingAccountOut: weft.get('total'),
          subRows: [
            'Contributions - WW ' + weft.get('worldwide'),
            'KHAHC ' + weft.get('khahc'),
            'GAA ' + weft.get('gaa'),
            'COAA ' + weft.get('coaa'),
            'CT ' + weft.get('ct'),
          ]
        });
        numWeftsTransfers++;
        model.checkingAccountOut += weft.get('total');
      }
    });
    if(numWeftsTransfers != 1){
      model.warnings.push('Found '+numInterestPayments+' interest payments - expected 1');
    }
  },

  calculateBalances(model){
    model.receiptsBalance = model.receiptsIn - model.receiptsOut;
    model.checkingAccountBalance = model.checkingAccountIn - model.checkingAccountOut;
    model.closingAccountBalance = model.openingBalance + model.checkingAccountBalance;
  },

  dateStr(date){
    return date.substring(5,7)+date.substring(8);;
  },

  monthStr(date){
    return date.substring(0, 7);
  }

});
