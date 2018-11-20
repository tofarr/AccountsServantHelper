import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({

  queryParams: ['month'],

  actions: {
    print(){
      window.print();
    }
  }
});
