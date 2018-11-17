import DS from 'ember-data';

export default DS.Model.extend({
  date: DS.attr('string'),
  local: DS.attr('number'),
  worldwide: DS.attr('number'),
  cash: DS.attr('number'),
  cheques: DS.attr('number')
});
