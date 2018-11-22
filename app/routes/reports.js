import Route from '@ember/routing/route';
import moment from 'moment';
import RSVP from 'rsvp';
import { inject } from '@ember/service';

export default Route.extend({

  calculations: inject('calculations'),

  model(){
    return new RSVP.Promise((resolve, reject) => {
      this.get('calculations').firstMeeting().then((firstMeeting) => {
        let months = [];
        var now = moment();
        var firstMoment = moment(firstMeeting, 'YYYY-MM-DD');
        while((firstMoment.year() < now.year())
         || ((firstMoment.year() == now.year()) && (firstMoment.month() <= now.month()))){
           months.push(firstMoment.format('YYYY-MM'));
           firstMoment.add(1, 'month');
         }
        months.reverse();
        resolve({
          months: months
        });
      }, reject);
    });
  }
});
