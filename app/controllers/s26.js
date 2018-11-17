import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({

  queryParams: ['month'],


  receiptsIn: computed('model.rows', function(){
    var ret = 0;
    this.get('model.rows').forEach((row) => {
      ret += row.receiptsIn || 0;
    });
    return ret;
  }),

  receiptsOut: computed('model.rows', function(){
    var ret = 0;
    this.get('model.rows').forEach((row) => {
      ret += row.receiptsOut || 0;
    });
    return ret;
  }),

  receiptsBalance: computed('receiptsIn', 'receiptsOut', function(){
    return this.get('receiptsIn') - this.get('receiptsOut');
  }),

  checkingAccountIn: computed('model.rows', function(){
    var ret = 0;
    this.get('model.rows').forEach((row) => {
      ret += row.checkingAccountIn || 0;
    });
    return ret;
  }),

  checkingAccountOut: computed('model.rows', function(){
    var ret = 0;
    this.get('model.rows').forEach((row) => {
      ret += row.checkingAccountOut || 0;
    });
    return ret;
  }),

  checkingAccountBalance: computed('checkingAccountIn', 'checkingAccountOut', function(){
    return this.get('checkingAccountIn') - this.get('checkingAccountOut');
  }),

  closingAccountBalance: computed('model',function(){
    return this.get('model.openingBalance') + this.get('checkingAccountIn') - this.get('checkingAccountOut');
  }),

  actions: {
    print(){
      window.print();
    }
  }
});
