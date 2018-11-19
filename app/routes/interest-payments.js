import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({

  interestPayments: inject('interest-payments'),

  model(){
    let interestPayments = this.get('interestPayments');
    return RSVP.hash({
      newInstance: interestPayments.newInstance(),
      list: interestPayments.list()
    });
  }


});
