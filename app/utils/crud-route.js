import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import RSVP from 'rsvp';
import {pluralize} from 'ember-inflector';

export default function crudRoute(type){

  return Route.extend({
    service: inject(pluralize(type)),
    model(){
      let service = this.get('service');
      return RSVP.hash({
        newInstance: service.newInstance(),
        list: service.list()
      });
    }
  });
}
