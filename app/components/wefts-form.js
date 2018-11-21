import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import add from '../utils/add';

export default Component.extend({
  tagName: 'form',
  classNames: ['wefts-form'],
  classNameBindings: ['valid:valid:invalid'],
  title: 'New WEFTS Transfer',
  submitText: 'Save Changes',
  service: inject('wefts'),

  valid: computed('model.{date,forLastMeeting,transferId,worldwideResolution,khahc,gaa,coaa,ct,worldwide}', function(){
    return this.get('service').isValid(this.get('model'));
  }),

  disabled: computed('submit', function(){
    return !this.get('submit');
  }),

  total: add('model.worldwideResolution', 'model.khahc', 'model.gaa', 'model.coaa', 'model.ct', 'model.worldwide')

});
