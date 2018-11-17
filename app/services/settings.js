import Service from '@ember/service';
import { storageFor } from 'ember-local-storage';
import RSVP from 'rsvp';
import Object from '@ember/object';

export default Service.extend({

  settings: storageFor('settings'),

  read(){
    return new RSVP.Promise((resolve) => {
      resolve(Object.create(this.get('settings.content')));
    })
  },

  update(settings){
    return new RSVP.Promise((resolve) => {
      this.get('settings').setProperties(settings);
      resolve(settings);
    });
  }
});
