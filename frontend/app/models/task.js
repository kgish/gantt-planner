import DS from 'ember-data';

export default DS.Model.extend({
  text: DS.attr('string'),
  start_date: DS.attr('date'),
  duration: DS.attr('number'),
  progress: DS.attr('number'),
  parent: DS.attr('number')
});
