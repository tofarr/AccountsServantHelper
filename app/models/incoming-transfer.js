import DS from 'ember-data';

export default DS.Model.extend({
  date: DS.attr('string'),
  transferId: DS.attr('string'),
  value: DS.attr('number')
});
