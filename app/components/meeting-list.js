import Component from '@ember/component';
import { sort } from '@ember/object/computed';

export default Component.extend({
  entriesSorting: ['date:desc'],
  sortedList: sort('list', 'entriesSorting'),

  actions: {
    remove(meeting){
      this.get('remove')(meeting);
    }
  }
});
