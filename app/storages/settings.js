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
      defaultOutgoingChequeAmt: 0,
      worldwideResolution: 0,
      khahc: 0,
      gaa: 0,
      coaa: 0,
      ct: 0
    };
  }
});

export default Storage;
