import Service from '@ember/service';
import { inject } from '@ember/service';
import moment from 'moment';
import md5 from 'md5';
import RSVP from 'rsvp';

export default Service.extend({

  settings: inject('settings'),
  dropbox: inject('dropbox'),
  backupPath: '/accountsServantHelper.json',
  store: inject('store'),
  settingsAttrs: ['openingBalance','otherBalance','congregation',
    'city','state','midweekMeetingDay','watchtowerMeetingDay','accountsServantName',
    'defaultOutgoingChequeAmt','khahc','gaa','coaa','ct'],


  init(){
    this._super(...arguments);
    this.notifyDropboxTokenChange = this.notifyDropboxTokenChange.bind(this);
    this.get('settings.settings').addObserver('dropboxToken', this.notifyDropboxTokenChange);
    //this.notifyDropboxTokenChange();
    window.addEventListener('beforeunload', this.notifyUnload.bind(this));
  },

  notifyDropboxTokenChange(){
    console.log('Dropbox token changed...');
    let dropboxToken = this.get('settings.settings.dropboxToken');
    this.get('dropbox').set('dropboxToken', dropboxToken);
    if(dropboxToken){
      this.read().then(() => {
        console.log('Backup read');
      },(error) => {
        let responseText = Ember.get(error, 'response.statusText');
        if(responseText && responseText.startsWith('path/not_found/')){
          this.write();
        }else{
          console.log('Reading backup failed', error);
        }
      });
    }
  },

  read(){
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
        this.get('settings.settings').setProperties({
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
    this.write();
  },

  write(){
    console.log('Writing backup to dropbox...');
    return new RSVP.Promise((resolve, reject) => {
      RSVP.hash({
        meetings: this.findAll('meeting'),
        deposits: this.findAll('deposit'),
        incomingTransfers: this.findAll('incoming-transfer'),
        interestPayments: this.findAll('interest-payment'),
        outgoingCheques: this.findAll('outgoing-cheque'),
        wefts: this.findAll('weft'),
        settings: this.get('settings').getProperties(this.get('settingsAttrs'))
      }).then((hash) => {
        let content = JSON.stringify(hash);
        let state = md5(content);
        if(this.get('settings.settings.dropboxState') == state){
          console.log('No changes to write to dropbox.');
          return;
        }
        this.get('dropbox').update(this.get('backupPath'), content).then(() => {
          console.log('...backup to dropbox written!');
          this.get('settings.settings').setProperties({
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
