import Controller from '@ember/controller';
import { inject } from '@ember/service';


export default Controller.extend({

  incomingTransfers: inject('incoming-transfers'),
  toast: inject('toast'),

  actions: {
    create(event){
      event.preventDefault();
      this.get('incomingTransfers').create(this.get('model.newInstance'))
      .then(() => {
        this.get('toast').info('Save Successful');
      }, (error) => {
        this.get('toast').error('Error Saving Changes');
      });
    },

    remove(incomingTransfer){
      this.get('incomingTransfers').remove(incomingTransfer)
      .then(() => {
        this.get('toast').info('Delete Successful');
      }, (error) => {
        this.get('toast').error('Error Deleting Record');
      });
    }
  }
});
