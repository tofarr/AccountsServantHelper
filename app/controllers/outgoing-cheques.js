import Controller from '@ember/controller';
import { inject } from '@ember/service';


export default Controller.extend({

  outgoingCheques: inject('outgoing-cheques'),
  toast: inject('toast'),

  actions: {
    create(event){
      event.preventDefault();
      this.get('outgoingCheques').create(this.get('model.newInstance'))
      .then(() => {
        this.get('toast').info('Save Successful');
      }, (error) => {
        this.get('toast').error('Error Saving Changes');
      });
    },

    update(outgoingCheque){
      this.get('outgoingCheques').update(outgoingCheque)
        .then(() => {
          this.get('toast').info('Update Successful');
        }, (error) => {
          this.get('toast').error('Error Updating Record');
        });
    },

    remove(outgoingCheque){
      if(!confirm('Are you sure?')){
        return;
      }
      this.get('outgoingCheques').remove(outgoingCheque)
      .then(() => {
        this.get('toast').info('Delete Successful');
      }, (error) => {
        this.get('toast').error('Error Deleting Record');
      });
    }
  }
});
