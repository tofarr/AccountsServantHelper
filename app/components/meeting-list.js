import Component from '@ember/component';
import { sort } from '@ember/object/computed';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['meeting-list','list'],
  entriesSorting: ['date:desc'],
  sortedList: sort('list', 'entriesSorting'),
  width: inject('width'),

  tableStyle: computed('width.width', function(){
    //debugger;
    let table = this.$('table');
    let tableWidth = table.width() || 548;
    let tableHeight = table.height();
    let width = this.get('width.width');
    let scale = Math.min(width / tableWidth, 1);
    let height = parseInt(tableHeight * scale);
    let tx = ((width - tableWidth) / 2) * scale;
    let ty = ((height - tableHeight) / 2) * scale;
    return 'position:relative;top:0;left:0;width:'+width+'px;height:'+height+'px;transform:matrix('+scale+', 0, 0, '+scale+', '+tx+', '+ty+');';
  }),

  actions: {
    showDetails(meeting){
      debugger
    },
    remove(meeting){
      this.get('remove')(meeting);
    }
  }
});
