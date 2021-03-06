/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import crudList from '../utils/crud-list';
import moment from 'moment';

export default crudList('deposit').extend({
  entriesSorting: ['issueDate:desc'],
  actions: {
    update(record, event){
      if(event){
        event.preventDefault()
      }
      this.get('update')(record);
      this.set('viewItem', false);
    },
    setProcessedDate(record, processedDate){
      record.set('processedDate', record ? moment(processedDate).format('YYYY-MM-DD') : null);
    }
  }
});
