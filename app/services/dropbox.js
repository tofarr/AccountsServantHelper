import Service from '@ember/service';
import RSVP from 'rsvp';
import dropbox from 'dropbox';
import { computed } from '@ember/object';

export default Service.extend({

  dropboxToken: null,
  dropbox: computed('key', function(){
    let dropboxToken = this.get('dropboxToken');
    return dropboxToken ? new dropbox.Dropbox({ accessToken: dropboxToken }) : null;
  }),

  read(path){
    return new RSVP.Promise((resolve, reject) => {
      let dropbox = this.get('dropbox');
      if(dropbox){
        dropbox.filesDownload({path: path}).then(function(response){
          var reader = new FileReader();
          reader.onload = function(){
            resolve(this.result);
          }
          reader.readAsBinaryString(response.fileBlob);
        }).catch(reject);
      }else{
        reject('NO_TOKEN');
      }
    });
  },

  update(path, data){
    return new RSVP.Promise((resolve, reject) => {
      let dropbox = this.get('dropbox');
      if(dropbox){
        dropbox.filesUpload({
          path: path,
          contents: data,
          mode: {".tag": "overwrite"}
        }).then(resolve).catch(reject);
      }else{
        reject('NO_TOKEN');
      }
    });
  }
});
