/* eslint-disable no-console */
import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({

  backup: inject('backup'),
  toast: inject('toast'),

  actions: {
    update(event){
      event.preventDefault();
      this.get('backup').update(this.get('model')).then(() => {
        this.get('toast').info('Save Successful');
      }, (error) => {
        console.error(error);
        this.get('toast').error('Error Saving Changes');
      });
    }
  }
});
