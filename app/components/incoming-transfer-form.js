import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'form',
  classNames: ['incoming-transfer-form'],
  classNameBindings: ['valid:valid:invalid'],
  title: 'New Incoming Transfer',
  submitText: 'Save Changes',
  service: inject('incoming-transfers'),

  valid: computed('model.{date,transferId,value}', function(){
    return this.get('service').isValid(this.get('model'));
  }),

  disabled: computed('submit', function(){
    return !this.get('submit');
  })
});
