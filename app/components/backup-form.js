import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({

  tagName: 'form',
  classNames: 'backup-form',
  title: 'Update Settings',
  submitText: 'Save Changes',
  backup: inject('backup'),

  actions: {
    saveBackup(){
      this.get('backup').saveBackup();
    },
    restoreFromBackup(){
      this.get('backup').restoreFromBackup();
    }
  }
});
