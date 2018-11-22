import moment from 'moment';
import RSVP from 'rsvp';
import { get, set } from '@ember/object';
import crudService from '../utils/crud-service';

export default crudService('meeting').extend({

  newInstance(){
    // Why oh Why is there no way to link this to the object in ember? Looks like I will be learning react soon.
    return {
      date: moment().format('YYYY-MM-DD'),
      local: null,
      worldwide: null,
      cash: null,
      cheques: null
    };
  },

  validate(meeting){
    var ret = [];
    let cash = get(meeting, 'cash') || 0;
    let cheques = get(meeting, 'cheques') || 0;
    let local = get(meeting, 'local') || 0;
    let worldwide = get(meeting, 'worldwide') || 0;
    if (cash < 0 || cheques < 0 || local < 0 || worldwide < 0){
      ret.push("All amounts must be greater than or equal to 0.");
    }
    if(!get(meeting, 'date')){
      ret.push("Meeting date should not be blank.");
    }
    let count1 = local + worldwide;
    let count2 = cash + cheques;
    if(count1 != count2){
      ret.push("Sum of Cash and Cheques should match Sum of Local and Worldwide");
    }
    if(get(meeting, 'cancellation')){
      if(count1){
        ret.push('No money is collected at cancelled meetings');
      }
    }else{
      if(!count1){
        ret.push("Local and worldwide should be positive numbers.");
      }
    }
    return ret;
  },

  sanitize(meeting){
    set(meeting, 'local', get(meeting, 'local') || 0);
    set(meeting, 'worldwide', get(meeting, 'worldwide') || 0);
    set(meeting, 'cash', get(meeting, 'cash') || 0);
    set(meeting, 'cheques', get(meeting, 'cheques') || 0);
  },

  overview(startDate, endDate){
    return new RSVP.Promise((resolve, reject) => {
      this.list().then((meetings) => {
        var ret = {
          localOpening: 0,
          local: 0,
          localClosing: 0,
          worldwideOpening: 0,
          worldwide: 0,
          worldwideClosing: 0,
          totalOpening: 0,
          total: 0,
          totalClosing: 0,
          results: []
        }
        meetings.forEach((meeting) => {
          let date = meeting.get('date');
          if(date < startDate){
            ret.localOpening += meeting.get('local');
            ret.worldwideOpening += meeting.get('worldwide');
          }else if(date < endDate){
            ret.local += meeting.get('local');
            ret.worldwide += meeting.get('worldwide');
            ret.results.push(meeting)
          }
        });
        ret.results.sortBy('date');
        ret.localClosing = ret.localOpening + ret.local;
        ret.worldwideClosing = ret.worldwideOpening + ret.worldwide;
        ret.totalOpening = ret.localOpening + ret.worldwideOpening;
        ret.total = ret.local + ret.worldwide;
        ret.totalClosing = ret.localClosing + ret.worldwideClosing;
        resolve(ret);
      }, reject);
    });
  }
});
