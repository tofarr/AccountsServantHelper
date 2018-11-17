import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'form',
  classNames: ['incoming-transfer-form'],
  classNameBindings: ['valid:valid:invalid'],
  title: 'New Incoming Transfer',
  submitText: 'Save Changes',
  incomingTransfers: inject('incoming-transfers'),

  valid: computed('model.{date,transferId,value}', function(){
    return this.get('incomingTransfers').isValid(this.get('model'));
  })

});
