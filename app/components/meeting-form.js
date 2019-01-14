import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import add from '../utils/add';
import { observer } from '@ember/object';

export default Component.extend({
  tagName: 'form',
  classNames: ['meeting-form'],
  classNameBindings: ['valid:valid:invalid'],
  title: 'New Meeting',
  submitText: 'Save Changes',
  service: inject('meetings'),

  valid: computed('model.{date,local,worldwide,cash,cheques}', function(){
    return this.get('service').isValid(this.get('model'));
  }),

  disabled: computed('submit', function(){
    return !this.get('submit');
  }),

  total : add('model.local','model.worldwide'),

  cashChequeSetter: observer('model.local', 'model.worldwide', 'model.cash', 'model.cheques', function(){
    let local = this.get('model.local');
    let worldwide = this.get('model.worldwide');
    if(local && worldwide){
      let cash = this.get('model.cash');
      let cheques = this.get('model.cheques');
      if(cash && (!cheques)){
        this.set('model.cheques', local + worldwide - cash);
      }else if(cheques && !cash){
        this.set('model.cash', local + worldwide - cheques);
      }
    }
  }),
});
