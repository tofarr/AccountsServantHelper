import { computed } from '@ember/object';
import Ember from 'ember';

export default function add() {
  let attrs = arguments;
  let args = [];
  args.push.apply(args, attrs);
  args.push(function(){
    var ret = 0;
    for(var a = 0; a < attrs.length; a++){
      ret += this.get(attrs[a]);
    }
    return ret;
  });
  return computed.apply(Ember, args);
}
