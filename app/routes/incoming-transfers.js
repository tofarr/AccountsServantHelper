import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({

  incomingTransfers: inject('incoming-transfers'),

  model(){
    let incomingTransfers = this.get('incomingTransfers');
    return RSVP.hash({
      newInstance: incomingTransfers.newInstance(),
      list: incomingTransfers.list()
    });
  }


});
