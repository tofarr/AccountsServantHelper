import Service from '@ember/service';
import { inject } from '@ember/service';
import RSVP from 'rsvp';

export default function crudService(type){
  return Service.extend({

    store: inject('store'),

    list(){
      return this.get('store').findAll(type);
    },

    isValid(record){
      return this.validate(record).length == 0;
    },

    create(record){
      let errors = this.validate(record);
      if(errors.length){
        return new RSVP.Promise((resolve, reject) => {
          reject(errors);
        });
      }
      if(this.sanitize){
        this.sanitize(record);
      }
      let ret = this.get('store').createRecord(type, record);
      return ret.save();
    },

    update(record){
      let errors = this.validate(record);
      if(errors.length){
        return new RSVP.Promise((resolve, reject) => {
          reject(errors);
        });
      }
      if(this.sanitize){
        this.sanitize(record);
      }
      return record.save();
    },

    remove(record){
      record.deleteRecord();
      return record.save();
    }
  });
}
