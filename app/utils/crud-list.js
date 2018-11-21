/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Component from '@ember/component';
import { sort } from '@ember/object/computed';

export default function crudList(type){
  return Component.extend({
    classNames: [type+'-list','list'],
    entriesSorting: ['date:desc'],
    sortedList: sort('list', 'entriesSorting'),

    actions: {
      view(record){
        this.set("viewItem", record);
      },
      remove(record){
        this.get('remove')(record);
      }
    }
  });
}
