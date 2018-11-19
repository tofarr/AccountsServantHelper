import Controller from '@ember/controller';
import { inject } from '@ember/service';


export default Controller.extend({

  interestPayments: inject('interest-payments'),
  toast: inject('toast'),

  actions: {
    create(event){
      event.preventDefault();
      this.get('interestPayments').create(this.get('model.newInstance'))
      .then(() => {
        this.get('toast').info('Save Successful');
      }, (error) => {
        this.get('toast').error('Error Saving Changes');
      });
    },

    update(interestPayment){
      this.get('interestPayments').update(interestPayment)
        .then(() => {
          this.get('toast').info('Update Successful');
        }, (error) => {
          this.get('toast').error('Error Updating Record');
        });
    },

    remove(interestPayment){
      this.get('interestPayments').remove(interestPayment)
      .then(() => {
        this.get('toast').info('Delete Successful');
      }, (error) => {
        this.get('toast').error('Error Deleting Record');
      });
    }
  }
});
