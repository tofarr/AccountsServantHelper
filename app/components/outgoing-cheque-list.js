import Component from '@ember/component';
import { sort } from '@ember/object/computed';

export default Component.extend({
  entriesSorting: ['issueDate:desc'],
  sortedList: sort('list', 'entriesSorting'),

  actions: {
    update(outgoingCheque){
      this.get('update')(outgoingCheque);
    },
    remove(outgoingCheque){
      this.get('remove')(outgoingCheque);
    },
    setProcessedDate(outgoingCheque, processedDate){
      outgoingCheque.set('processedDate', processedDate ? moment(processedDate).format('YYYY-MM-DD') : null);
    }
  }
});
