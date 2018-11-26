/* eslint-disable no-console */
/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Service from '@ember/service';
import { inject } from '@ember/service';
import moment from 'moment';
import md5 from 'md5';
import RSVP from 'rsvp';
import { storageFor } from 'ember-local-storage';

export default Service.extend({

  settings: inject('settings'),
  dropbox: inject('dropbox'),
  backupPath: '/accountsServantHelper.json',
  store: inject('store'),
  storage: storageFor('backup'),
  toast: inject('toast'),

  read(){
    return new RSVP.Promise((resolve) => {
      resolve(Object.create(this.get('storage.content')));
    })
  },

  update(backup){
    return new RSVP.Promise((resolve) => {
      this.get('storage').set('dropboxToken', backup.dropboxToken);
      this.get('storage').set('dropboxSyncedAt', backup.dropboxSyncedAt);
      resolve(backup);
    });
  },

  init(){
    this._super(...arguments);
    this.notifyUnload = this.notifyUnload.bind(this);
    window.addEventListener('beforeunload', this.notifyUnload);
    this.notifyBlur = this.notifyBlur.bind(this);
    window.addEventListener('blur', this.notifyBlur)
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

  notifyBlur(event){
    if(event.target == window){
      this.notifyUnload();
    }
  },

  notifyUnload(){
    //Dont thrash dropbox - autosave a max of once every 10 minutes
    let dropboxSyncedAt = this.get('storage.dropboxSyncedAt');
    let now = moment().valueOf();
    let nextSync = dropboxSyncedAt ? moment(dropboxSyncedAt, 'YYYY-MM-DD HH:mm:ss').add(10, 'minute').valueOf() : now;
    if(nextSync <= now){
      this.saveBackup();
    }
  },

  saveBackup(force){
    console.log('Writing backup to dropbox...');
    return new RSVP.Promise((resolve, reject) => {
      RSVP.hash({
        meetings: this.findAll('meeting', 'date'),
        deposits: this.findAll('deposit', 'date'),
        incomingTransfers: this.findAll('incoming-transfer', 'date'),
        interestPayments: this.findAll('interest-payment', 'date'),
        outgoingCheques: this.findAll('outgoing-cheque', 'issueDate'),
        wefts: this.findAll('weft', 'date'),
        settings: this.get('settings.settings.content')
      }).then((hash) => {
        let content = JSON.stringify(hash);
        let state = md5(content);
        if((!force) && (this.get('storage.dropboxState') == state)){
          console.log('No changes to write to dropbox.');
          resolve();
          return;
        }
        this.get('dropbox').update(this.get('backupPath'), content).then(() => {
          console.log('...backup to dropbox written!');
          this.get('storage').setProperties({
            dropboxSyncedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            dropboxState: state
          });
          resolve();
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

  findAll(type, sortBy){
    return new RSVP.Promise((resolve, reject) => {
      this.get('store').findAll(type).then((records) => {
        records = records.sortBy(sortBy);
        resolve(records.map((record) => {
          return record.toJSON();
        }));
      }, reject);
    });
  }

});
