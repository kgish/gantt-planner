import DS from 'ember-data';

export default DS.Model.extend({
  link_id: DS.attr('number'),
  source_id: DS.attr('number'),
  target_id: DS.attr('number'),
  code: DS.attr('number')
});
