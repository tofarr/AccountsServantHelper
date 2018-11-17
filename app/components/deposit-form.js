import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import add from '../utils/add';

export default Component.extend({
  tagName: 'form',
  classNames: ['deposit-form'],
  classNameBindings: ['valid:valid:invalid'],
  title: 'New Deposit',
  submitText: 'Save Changes',
  deposits: inject('deposits'),

  valid: computed('model.{date,forLastMeeting,cash,cheques}', function(){
    return this.get('deposits').isValid(this.get('model'));
  }),

  total: add('model.cash','model.cheques')

});
