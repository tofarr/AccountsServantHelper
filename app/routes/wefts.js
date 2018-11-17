import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({

  wefts: inject('wefts'),

  model(){
    let wefts = this.get('wefts');
    return RSVP.hash({
      newInstance: wefts.newInstance(),
      list: wefts.list()
    });
  }


});
