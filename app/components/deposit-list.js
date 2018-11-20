import Component from '@ember/component';
import { sort } from '@ember/object/computed';

export default Component.extend({
  entriesSorting: ['date:desc'],
  sortedList: sort('list', 'entriesSorting'),

  actions: {
    view(deposit){
      this.set("viewItem", deposit);
    },
    remove(deposit){
      this.get('remove')(deposit);
    }
  }
});
