import Service from '@ember/service';
import { inject } from '@ember/service';
import RSVP from 'rsvp';
import add from '../utils/add';

export default Service.extend({
  store: inject('store'),

  recieptsBalance(){
    return new RSVP.Promise((resolve, reject) => {
      this.get('store').findAll('meeting').then((meetings) => {
        var balance = {
          cash: 0,
          cheques: 0,
          lastMeeting: null,
          lastDeposit: null,
          total : add('cash','cheques')
        }
        meetings.forEach((meeting) => {
          balance.cash += meeting.get('cash');
          balance.cheques += meeting.get('cheques');
          if((!balance.lastMeeting) || (balance.lastMeeting < meeting.get('date'))){
            balance.lastMeeting = meeting.get('date');
          }
        });
        this.get('store').findAll('deposit').then((deposits) => {
          deposits.forEach((deposit) => {
            balance.cash -= deposit.get('cash');
            balance.cheques -= deposit.get('cheques');
            if((!balance.lastDeposit) || (balance.lastDeposit < deposit.get('date'))){
              balance.lastDeposit = deposit.get('date');
            }
          });
          resolve(balance);
        });
      }, reject);
    });
  }
});
