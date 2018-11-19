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
  },

  overview(startDate, endDate){
    return new RSVP.Promise((resolve, reject) => {
      this.list().then((wefts) => {
        var ret = {

          khahcOpening: 0,
          gaaOpening: 0,
          coaaOpening: 0,
          ctOpening: 0,
          worldwideOpening: 0,
          totalOpening: 0,

          khahc: 0,
          gaa: 0,
          coaa: 0,
          ct: 0,
          worldwide: 0,
          total: 0,

          khahcClosing: 0,
          gaaClosing: 0,
          coaaClosing: 0,
          ctClosing: 0,
          worldwideClosing: 0,
          totalClosing: 0,

          results: []
        }
        wefts.forEach((weft) => {
          let date = weft.get('forLastMeeting');
          if(date < startDate){
            ret.khahcOpening += weft.get('khahc');
            ret.gaaOpening += weft.get('gaa');
            ret.coaaOpening += weft.get('coaa');
            ret.ctOpening += weft.get('ct');
            ret.worldwideOpening += weft.get('worldwide');
          }else if(date < endDate){
            ret.khahc += weft.get('khahc');
            ret.gaa += weft.get('gaa');
            ret.coaa += weft.get('coaa');
            ret.ct += weft.get('ct');
            ret.worldwide += weft.get('worldwide');
            ret.results.push(weft)
          }
        });
        ret.results.sortBy('forLastMeeting');
        ret.totalOpening
        ret.KhahcClosing = ret.khahcOpening + ret.khahc;
        ret.GaaClosing = ret.gaaOpening + ret.gaa;
        ret.CoaaClosing = ret.coaaOpening + ret.khahc;
        ret.CtClosing = ret.ctOpening + ret.khahc;
        ret.WorldwideClosing = ret.worldwideOpening + ret.khahc;
        resolve(ret);
      }, reject);
    });
  }
});
