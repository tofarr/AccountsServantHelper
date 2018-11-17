import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({

  deposits: inject('deposits'),

  model(){
    let deposits = this.get('deposits');
    return RSVP.hash({
      newInstance: deposits.newInstance(),
      list: deposits.list()
    });
  }


});
