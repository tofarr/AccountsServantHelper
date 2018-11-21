/* eslint-disable no-console */
import Controller from '@ember/controller';
import { inject } from '@ember/service';
import {pluralize} from 'ember-inflector';

export default function crudController(type){
  return Controller.extend({

    service: inject(pluralize(type)),
    toast: inject('toast'),

    actions: {
      create(event){
        event.preventDefault();
        this.get('service').create(this.get('model.newInstance'))
        .then(() => {
          this.get('toast').info('Save Successful');
        }, (error) => {
          console.error(error);
          this.get('toast').error('Error Saving Changes');
        });
      },

      update(record){
        this.get('service').update(record)
          .then(() => {
            this.get('toast').info('Update Successful');
          }, (error) => {
            console.error(error);
            this.get('toast').error('Error Updating Record');
          });
      },

      remove(record){
        if(!confirm('Are you sure?')){
          return;
        }
        this.get('service').remove(record)
        .then(() => {
          this.get('toast').info('Delete Successful');
        }, (error) => {
          console.error(error);
          this.get('toast').error('Error Deleting Record');
        });
      }
    }
  });
}
