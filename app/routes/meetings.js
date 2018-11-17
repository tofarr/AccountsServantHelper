import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({

  meetings: inject('meetings'),

  model(){
    let meetings = this.get('meetings');
    return RSVP.hash({
      newInstance: meetings.newInstance(),
      list: meetings.list()
    });
  }
});
