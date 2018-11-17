import Controller from '@ember/controller';
import { inject } from '@ember/service';


export default Controller.extend({

  deposits: inject('deposits'),
  toast: inject('toast'),

  actions: {
    create(event){
      event.preventDefault();
      this.get('deposits').create(this.get('model.newInstance'))
      .then(() => {
        this.get('toast').info('Save Successful');
      }, (error) => {
        this.get('toast').error('Error Saving Changes');
      });
    },

    remove(deposit){
      this.get('deposits').remove(deposit)
      .then(() => {
        this.get('toast').info('Delete Successful');
      }, (error) => {
        this.get('toast').error('Error Deleting Record');
      });
    }
  }
});
