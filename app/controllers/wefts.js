import Controller from '@ember/controller';
import { inject } from '@ember/service';


export default Controller.extend({

  wefts: inject('wefts'),
  toast: inject('toast'),

  actions: {
    create(event){
      event.preventDefault();
      this.get('wefts').create(this.get('model.newInstance'))
      .then(() => {
        this.get('toast').info('Save Successful');
      }, (error) => {
        this.get('toast').error('Error Saving Changes');
      });
    },

    remove(wefts){
      if(!confirm('Are you sure?')){
        return;
      }
      this.get('wefts').remove(wefts)
      .then(() => {
        this.get('toast').info('Delete Successful');
      }, (error) => {
        this.get('toast').error('Error Deleting Record');
      });
    }
  }
});
