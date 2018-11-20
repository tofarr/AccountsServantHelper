import StorageObject from 'ember-local-storage/local/object';

const Storage = StorageObject.extend();

Storage.reopenClass({
  initialState() {
    return {
      dropboxToken: null,
      dropboxSyncedAt: null,
      dropboxState: null,
      openingBalance: 0,
      otherBalance: 0,
      congregation: null,
      city: null,
      state: null,
      midweekMeetingDay : 3,
      watchtowerMeetingDay: 0,
      accountsServantName: '',
      defaultOutgoingChequeAmt: 55000,
      khahc: 60000,
      gaa: 7400,
      coaa: 6500,
      ct: 1800
    };
  }
});

export default Storage;
