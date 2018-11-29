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
        this.notifyPropertyChange('model');
        this.rerender();
      },()=>{
        this.get('toast').error('Saving backup failed');
      });
    },
    restoreFromBackup(){
      if(!confirm('Are you sure? (This cannot be undone!)')){
        return;
      }
      this.get('backup').restoreFromBackup().then(() => {
        this.get('toast').info('Backup read');
        this.notifyPropertyChange('model');
        this.rerender();
      },()=>{
        this.get('toast').error('Reading backup failed');
      });
    }
  }
});
