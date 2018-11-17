import Controller from '@ember/controller';
import { inject } from '@ember/service';


export default Controller.extend({

  meetings: inject('meetings'),
  toast: inject('toast'),

  actions: {
    create(event){
      event.preventDefault();
      this.get('meetings').create(this.get('model.newInstance'))
      .then(() => {
        this.get('toast').info('Save Successful');
      }, (error) => {
        this.get('toast').error('Error Saving Changes');
      });
    },

    destroy(meeting){
      this.get('meetings').destroy(meeting)
      .then(() => {
        this.get('toast').info('Delete Successful');
      }, (error) => {
        this.get('toast').error('Error Deleting Record');
      });
    }
  }
});
