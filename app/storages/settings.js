import StorageObject from 'ember-local-storage/local/object';

const Storage = StorageObject.extend();

Storage.reopenClass({
  initialState() {
    return {
      openingBalance: 0,
      KHAHC: 0,
      GAA: 0,
      COAA: 0,
      CT: 0
    };
  }
});

export default Storage;
