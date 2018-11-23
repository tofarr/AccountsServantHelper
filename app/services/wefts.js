import { inject } from '@ember/service';
import moment from 'moment';
import RSVP from 'rsvp';
import crudService from '../utils/crud-service';

export default crudService('weft').extend({

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
            worldwideResolution: settings.get('worldwideResolution'),
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

  validate(weft){
    let ret = [];
    if(!weft.date){
      ret.push('Date must not be blank!');
    }
    if(!weft.transferId){
      ret.push('Transfer Id must not be blank!');
    }
    if(weft.worldwide < 0){
      ret.push('Worldwide (Box) must be greater than or equal to 0');
    }
    if(weft.worldwideResolution < 0){
      ret.push('Worldwide (Resolution) must be greater than or equal to 0');
    }
    if(weft.khahc < 0){
      ret.push('KHAHC must be greater than or equal to 0');
    }
    if(weft.gaa < 0){
      ret.push('GAA must be greater than or equal to 0');
    }
    if(weft.coaa < 0){
      ret.push('COAA must be greater than or equal to 0');
    }
    if(weft.ct < 0){
      ret.push('CT must be greater than or equal to 0');
    }
    if(!(weft.worldwide || weft.worldwideResolution || weft.khahc || weft.gaa || weft.coaa || weft.ct)){
      ret.push('Total must be greater than 0!');
    }
    return ret;
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
          worldwideResolutionOpening: 0,
          totalOpening: 0,

          khahc: 0,
          gaa: 0,
          coaa: 0,
          ct: 0,
          worldwide: 0,
          worldwideResolution: 0,
          total: 0,

          khahcClosing: 0,
          gaaClosing: 0,
          coaaClosing: 0,
          ctClosing: 0,
          worldwideClosing: 0,
          worldwideResolutionClosing: 0,
          totalClosing: 0,

          results: [],
          notInOpening: [],
          notInOpeningTotal: 0,
          notInClosing: [],
          notInClosingTotal: 0
        }
        wefts.forEach((weft) => {
          let date = weft.get('date');
          let forLastMeeting = weft.get('forLastMeeting');
          if(forLastMeeting < startDate){
            ret.khahcOpening += weft.get('khahc');
            ret.gaaOpening += weft.get('gaa');
            ret.coaaOpening += weft.get('coaa');
            ret.ctOpening += weft.get('ct');
            ret.worldwideOpening += weft.get('worldwide');
            ret.worldwideResolutionOpening += weft.get('worldwideResolution');
            ret.totalOpening += weft.get('total');
            if(date >= startDate && date < endDate){
              ret.notInOpening.push(weft);
              ret.notInOpeningTotal += weft.get('total');
            }
          }else if(forLastMeeting < endDate){
            ret.khahc += weft.get('khahc');
            ret.gaa += weft.get('gaa');
            ret.coaa += weft.get('coaa');
            ret.ct += weft.get('ct');
            ret.worldwide += weft.get('worldwide');
            ret.worldwideResolution += weft.get('worldwideResolution');
            ret.total += weft.get('total');
            ret.results.push(weft);
            if(date >= endDate){
              ret.notInClosing.push(weft);
              ret.notInClosingTotal += weft.get('total');
            }
          }
        });
        ret.results.sortBy('forLastMeeting');
        ret.KhahcClosing = ret.khahcOpening + ret.khahc;
        ret.GaaClosing = ret.gaaOpening + ret.gaa;
        ret.CoaaClosing = ret.coaaOpening + ret.khahc;
        ret.CtClosing = ret.ctOpening + ret.khahc;
        ret.worldwideClosing = ret.worldwideOpening + ret.khahc;
        ret.worldwideResolutionClosing = ret.worldwideResolutionOpening + ret.worldwideResolution;
        ret.totalClosing = ret.totalOpening + ret.total;
        resolve(ret);
      }, reject);
    });
  }
});
