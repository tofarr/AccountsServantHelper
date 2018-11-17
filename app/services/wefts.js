import Service from '@ember/service';
import { inject } from '@ember/service';
import moment from 'moment';
import RSVP from 'rsvp';

export default Service.extend({

  store: inject('store'),
  settings: inject('settings'),
  calculations: inject('calculations'),

  list(){
    return this.get('store').findAll('weft');
  },

  newInstance(){
    return new RSVP.Promise((resolve, reject) => {
      this.get('settings').read().then((settings) => {
        this.get('calculations').weftsBalance().then((balance) => {
          resolve({
            date: moment().format('YYYY-MM-DD'),
            forLastMeeting: balance.lastMeeting,
            transferId: null,
            khahc: settings.get('khahc'),
            gaa: settings.get('gaa'),
            coaa: settings.get('coaa'),
            ct: settings.get('ct'),
            worldwide: balance.value
          });
        },reject);
      },reject);
    });
  },

  isValid(weft){
    return weft.date
      && weft.transferId
      && (weft.khahc >= 0)
      && (weft.gaa >= 0)
      && (weft.coaa >= 0)
      && (weft.ct >= 0)
      && (weft.worldwide >= 0)
  },

  create(weft){
    if(!this.isValid(weft)){
      return new RSVP.Promise((resolve, reject) => {
        reject('Invalid WEFTS');
      });
    }
    let record = this.get('store').createRecord('weft', weft);
    return record.save();
  },

  remove(record){
    record.deleteRecord();
    return record.save();
  }
});
