import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({

  settings: inject('settings'),
  toast: inject('toast'),

  actions: {
    update(event){
      event.preventDefault();
      this.get('settings').update(this.get('model')).then(() => {
        this.get('toast').info('Save Successful');
      }, (error) => {
        this.get('toast').error('Error Saving Changes');
      });
    }
  }
});
