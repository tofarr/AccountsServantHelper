import Component from '@ember/component';

export default Component.extend({

  tagName: 'form',
  classNames: 'settings-form',
  title: 'Update Settings',
  submitText: 'Update',

  submit(event){
    event.preventDefault();
    
  }

});
