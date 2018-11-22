import StorageObject from 'ember-local-storage/local/object';

const Storage = StorageObject.extend();

Storage.reopenClass({
  initialState() {
    return {
      dropboxToken: null,
      dropboxSyncedAt: null,
      dropboxState: null,
    };
  }
});

export default Storage;
