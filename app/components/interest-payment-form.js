import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'form',
  classNames: ['interest-payment-form'],
  classNameBindings: ['valid:valid:invalid'],
  title: 'New Interest Payment',
  submitText: 'Save Changes',
  interestPayments: inject('interest-payments'),

  valid: computed('model.{issueDate,processedDate,chequeId,value,notes}', function(){
    return this.get('interestPayments').isValid(this.get('model'));
  })

});
