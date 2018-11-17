import DS from 'ember-data';
import add from '../utils/add';

export default DS.Model.extend({
  date: DS.attr('string'),
  forLastMeeting: DS.attr('string'),
  transferId: DS.attr('string'),
  khahc: DS.attr('number'),
  gaa: DS.attr('number'),
  coaa: DS.attr('number'),
  ct: DS.attr('number'),
  worldwide: DS.attr('number'),
  total: add('khahc', 'gaa', 'coaa', 'ct', 'worldwide')
});
