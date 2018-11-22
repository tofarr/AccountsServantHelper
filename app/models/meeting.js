import DS from 'ember-data';
import add from '../utils/add';

export default DS.Model.extend({
  date: DS.attr('string'),
  local: DS.attr('number'),
  worldwide: DS.attr('number'),
  cash: DS.attr('number'),
  cheques: DS.attr('number'),
  total: add('cash', 'cheques'),
  cancellation: DS.attr('string')
});
