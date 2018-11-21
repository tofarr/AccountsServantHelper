import Controller from '@ember/controller';

export default Controller.extend({

  queryParams: ['month'],

  actions: {
    print(){
      window.print();
    }
  }
});
