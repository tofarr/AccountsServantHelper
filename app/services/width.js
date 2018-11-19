import Service from '@ember/service';

export default Service.extend({

  width: 800,

  init(){
    this._super(...arguments);
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
    this.onResize();
  },

  willDestroy(){
    window.removeEventListener('resize', this.onResize);
  },

  onResize(){
    this.set('width', window.outerWidth);
  }
});
