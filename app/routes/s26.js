import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import RSVP from 'rsvp';
import moment from 'moment';

export default Route.extend({

  store: inject('store'),
  settings: inject('settings'),
  queryParams: {
    month: {
      refreshModel: true,
      replace: false
    }
  },

  model(params){
    return new RSVP.Promise((resolve, reject) => {
      RSVP.hash({
        settings: this.get('settings').read(),
        meetings: this.get('store').findAll('meeting'),
        deposits: this.get('store').findAll('deposit'),
        incomingTransfers: this.get('store').findAll('incoming-transfer'),
        outgoingCheques: this.get('store').findAll('outgoing-cheque'),
        wefts: this.get('store').findAll('weft')
      }).then((hash)=>{
        var model = {
          openingBalance: 0,
          otherBalance: 0,
          //receiptsIn: 0,
          //receiptsOut: 0,
          //checkingAccountIn: 0,
          //checkingAccountOut: 0,
          rows: [],
          warnings: []
        };
        this.addParamsToModel(params, model);
        this.addSettingsToModel(hash.settings, model);
        this.addMeetingsToModel(hash.meetings, model);
        this.addDepositsToModel(hash.deposits, model);
        this.addIncomingTransfersToModel(hash.incomingTransfers, model);
        this.addOutgoingChequesToModel(hash.outgoingCheques, model);
        this.addWEFTSToModel(hash.wefts, model);
        resolve(model)
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
    model.monthEnding = month.endOf('month').format('MMMM DD YYYY');
  },

  addSettingsToModel(settings, model){
    model.congregation = settings.congregation;
    model.city = settings.city;
    model.state = settings.state;
    model.openingBalance += settings.openingBalance;
    model.otherBalance += settings.otherBalance;
  },

  addMeetingsToModel(meetings, model){
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
    })
  },

  addDepositsToModel(deposits, model){
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
      }
    })
  },

  addIncomingTransfersToModel(incomingTransfers, model){
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
      }
    });
  },

  addOutgoingChequesToModel(outgoingCheques, model){
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
      }
    });
  },

  addWEFTSToModel(wefts, model){
    wefts.forEach((weft) => {
      let date = weft.get('date');
      let monthStr = this.monthStr(date);
      if(monthStr < model.monthStr){
        model.openingBalance -= weft.get('total');
      }else if(monthStr == model.monthStr){
        let subRows = [
          'Contributions - WW ' + weft.get('worldwide'),
          'KHAHC ' + weft.get('khahc'),
          'GAA ' + weft.get('gaa'),
          'COAA ' + weft.get('coaa'),
          'CT ' + weft.get('ct'),
        ];

        model.rows.push({
          date: this.dateStr(date),
          description: 'WEFTS ('+weft.get('transferId')+')',
          checkingAccountOut: weft.get('total'),
          subRows: subRows
        });
      }
    });
  },

  dateStr(date){
    return date.substring(5,7)+date.substring(8);;
  },

  monthStr(date){
    return date.substring(0, 7);
  }
});
