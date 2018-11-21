/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Component from '@ember/component';

export default Component.extend({
  tagName: 'label',
  classNames: ['field', 'day-field'],
  days: [ {value:0,title:'Sunday'},
          {value:1,title:'Monday'},
          {value:2,title:'Tuesday'},
          {value:3,title:'Wednesday'},
          {value:4,title:'Thursday'},
          {value:5,title:'Friday'},
          {value:6,title:'Saturday'}],

  change(event){
    this.set('value', parseInt(event.target.value));
  }
});
