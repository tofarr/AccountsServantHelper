import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({

  queryParams: ['month'],
  width: inject('width'),

  pageStyle: computed('width.width', function(){
    let width = this.get('width.width');
    let scale = width / 1700;
    let height = parseInt(2200 * scale);
    let tx = ((width - 1700) / 2) * scale;
    let ty = ((height - 2200) / 2) * scale;
    return 'position:relative;top:0;left:0;width:'+width+'px;height:'+height+'px;transform:matrix('+scale+', 0, 0, '+scale+', '+tx+', '+ty+');';
  }),

    actions: {
      print(){
        this.set("width.width", 1700);
        Ember.run.later(()=>{
          window.print();
          this.get("width").onResize();
        });
      }
    }
});
