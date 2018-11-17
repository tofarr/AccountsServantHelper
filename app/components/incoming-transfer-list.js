import Component from '@ember/component';
import { sort } from '@ember/object/computed';

export default Component.extend({
  entriesSorting: ['date:desc'],
  sortedList: sort('list', 'entriesSorting'),

  actions: {
    remove(outgoingCheque){
      this.get('remove')(outgoingCheque);
    },
    setProcessedDate(outgoingCheque, processedDate){
      outgoingCheque.set('processedDate', processedDate ? moment(processedDate).format('YYYY-MM-DD') : null);
    }
  }
});
