import DS from 'ember-data';
import add from '../utils/add';

export default DS.Model.extend({
  date: DS.attr('string'),
  forLastMeeting: DS.attr('string'),
  cash: DS.attr('number'),
  cheques: DS.attr('number'),
  total: add('cash', 'cheques')
});
