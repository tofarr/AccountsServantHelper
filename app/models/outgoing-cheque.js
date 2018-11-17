import DS from 'ember-data';

export default DS.Model.extend({
  issueDate: DS.attr('string'),
  processedDate: DS.attr('string'),
  chequeId: DS.attr('string'),
  value: DS.attr('number'),
  notes: DS.attr('string')
});
