import Component from '@ember/component';

export default Component.extend({
  classNames: ['field', 'number-field'],
  min: -100000000,
  max: 100000000,

  change(){
    debugger;
  }
});
