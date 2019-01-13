import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  tagName: 'form',
  classNames: ['print-form'],

  nextMonthParam: computed('monthParam', function(){
    return moment(this.get('monthParam'), 'YYYY-MM').add(1, 'month').format('YYYY-MM');
  }),

  prevMonthParam: computed('monthParam', function(){
    return moment(this.get('monthParam'), 'YYYY-MM').add(-1, 'month').format('YYYY-MM');
  }),

  actions: {
    print(){
      if(window.tofarrCordovaPrint){
        window.tofarrCordovaPrint.doPrint();
      }else{
        window.print();
      }
    }
  }
});
