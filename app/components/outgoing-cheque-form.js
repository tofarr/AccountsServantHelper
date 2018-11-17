import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'form',
  classNames: ['outgoing-cheque-form'],
  classNameBindings: ['valid:valid:invalid'],
  title: 'New Outgoing Cheque',
  submitText: 'Save Changes',
  outgoingCheques: inject('outgoing-cheques'),

  valid: computed('model.{issueDate,processedDate,chequeId,value,notes}', function(){
    return this.get('outgoingCheques').isValid(this.get('model'));
  })

});
