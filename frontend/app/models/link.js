import DS from 'ember-data';

export default DS.Model.extend({
  source: DS.attr('number'),
  target: DS.attr('number'),
  code: DS.attr('number')
});
