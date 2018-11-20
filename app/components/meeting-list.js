import Component from '@ember/component';
import { sort } from '@ember/object/computed';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['meeting-list','list'],
  entriesSorting: ['date:desc'],
  sortedList: sort('list', 'entriesSorting'),
  width: inject('width'),

  actions: {
    view(meeting){
      this.set("viewItem", meeting);
    },
    remove(meeting){
      this.get('remove')(meeting);
    }
  }
});
