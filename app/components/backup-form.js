import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({

  tagName: 'form',
  classNames: 'backup-form',
  title: 'Update Settings',
  submitText: 'Save Changes',
  backup: inject('backup'),
  toast: inject('toast'),

  actions: {
    saveBackup(){
      this.get('backup').saveBackup().then(() => {
        this.get('toast').info('Backup saved');
      },()=>{
        this.get('toast').info('Saving backup failed');
      });
    },
    restoreFromBackup(){
      if(!confirm('Are you sure? (This cannot be undone!)')){
        return;
      }
      this.get('backup').restoreFromBackup().then(() => {
        this.get('toast').info('Backup read');
      },()=>{
        this.get('toast').info('Reading backup failed');
      });
    }
  }
});
