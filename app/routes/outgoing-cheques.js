import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({

  outgoingCheques: inject('outgoing-cheques'),

  model(){
    let outgoingCheques = this.get('outgoingCheques');
    return RSVP.hash({
      newInstance: outgoingCheques.newInstance(),
      list: outgoingCheques.list()
    });
  }


});
