import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import add from '../utils/add';

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

  total : add('model.local','model.worldwide')
});
