/* eslint-disable no-console */
/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Service from '@ember/service';
import { inject } from '@ember/service';
import moment from 'moment';
import md5 from 'md5';
import RSVP from 'rsvp';
import { get } from '@ember/object';
import { storageFor } from 'ember-local-storage';

export default Service.extend({

  settings: inject('settings'),
  dropbox: inject('dropbox'),
  backupPath: '/accountsServantHelper.json',
  store: inject('store'),
  storage: storageFor('backup'),

  read(){
    return new RSVP.Promise((resolve) => {
      resolve(Object.create(this.get('storage.content')));
    })
  },

  update(backup){
    return new RSVP.Promise((resolve) => {
      this.get('storage').setProperties(backup);
      resolve(backup);
    });
  },

  init(){
    this._super(...arguments);
    this.notifyDropboxTokenChange = this.notifyDropboxTokenChange.bind(this);
    this.get('storage').addObserver('dropboxToken', this.notifyDropboxTokenChange);
    window.addEventListener('beforeunload', this.notifyUnload.bind(this));
  },

  notifyDropboxTokenChange(){
    console.log('Dropbox token changed...');
    let dropboxToken = this.get('backup.dropboxToken');
    this.get('dropbox').set('dropboxToken', dropboxToken);
    if(dropboxToken){
      this.restoreFromBackup().then(() => {
        console.log('Backup read');
      },(error) => {
        let responseText = get(error, 'response.statusText');
        if(responseText && responseText.startsWith('path/not_found/')){
          this.saveBackup();
        }else{
          console.log('Reading backup failed', error);
        }
      });
    }
  },

  restoreFromBackup(){
    console.log('Reading backup from dropbox...');
    return new RSVP.Promise((resolve, reject) => {
      this.get('dropbox').read(this.get('backupPath')).then((data) => {
        let backup = JSON.parse(data);
        this.overwrite('meeting', backup.meetings);
        this.overwrite('deposit', backup.deposits);
        this.overwrite('incoming-transfer', backup.incomingTransfers);
        this.overwrite('interest-payment', backup.interestPayments);
        this.overwrite('outgoing-cheque', backup.outgoingCheques);
        this.overwrite('weft', backup.wefts);
        this.get('settings.settings').setProperties(backup.settings);
        this.get('storage').setProperties({
          dropboxSyncedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          dropboxState: md5(data)
        });
        console.log('...Backup from dropbox read!');
        resolve();
      }, reject);
    });
  },

  notifyUnload(){
    console.log('Unloading...');
    this.saveBackup();
  },

  saveBackup(force){
    console.log('Writing backup to dropbox...');
    return new RSVP.Promise((resolve, reject) => {
      RSVP.hash({
        meetings: this.findAll('meeting'),
        deposits: this.findAll('deposit'),
        incomingTransfers: this.findAll('incoming-transfer'),
        interestPayments: this.findAll('interest-payment'),
        outgoingCheques: this.findAll('outgoing-cheque'),
        wefts: this.findAll('weft'),
        settings: this.get('settings.settings.content')
      }).then((hash) => {
        let content = JSON.stringify(hash);
        let state = md5(content);
        if((!force) && (this.get('backup.dropboxState') == state)){
          console.log('No changes to write to dropbox.');
          return;
        }
        this.get('dropbox').update(this.get('backupPath'), content).then(() => {
          console.log('...backup to dropbox written!');
          this.get('storage').setProperties({
            dropboxSyncedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            dropboxState: state
          });
        }, reject);
      }, reject);
    });
  },

  overwrite(type, items){
    this.removeAll(type).then(() => {
      this.addAll(type, items);
    });
  },

  addAll(type, items){
    let store = this.get('store');
    items.forEach((item) => {
      store.createRecord(type, item).save();

    });
  },

  removeAll(type){
    return this.get('store').findAll(type).then((records) => {
      records.forEach((record) => {
        record.deleteRecord();
        if(!record.get('isNew')){
          record.save();
        }
      });
    })
  },

  findAll(type){
    return new RSVP.Promise((resolve, reject) => {
      this.get('store').findAll(type).then((records) => {
        resolve(records.map((record) => {
          return record.toJSON();
        }));
      }, reject);
    });
  }

});
