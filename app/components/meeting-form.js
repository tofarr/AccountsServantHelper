import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'form',
  classNames: ['meeting-form'],
  classNameBindings: ['valid:valid:invalid'],
  title: 'New Meeting',
  submitText: 'Save Changes',
  meetings: inject('meetings'),

  valid: computed('model.{date,local,worldwide,cash,cheques}', function(){
    return this.get('meetings').isValid(this.get('model'));
  }),

});
