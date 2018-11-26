import Controller from '@ember/controller';

export default Controller.extend({

  queryParams: ['month'],

  actions: {
    print(){
      if(window.tofarrCordovaPrint){
        window.tofarrCordovaPrint.doPrint();
      }else{
        window.print();
      }
    }
  }
});
