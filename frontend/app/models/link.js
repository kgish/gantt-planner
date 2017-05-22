import DS from 'ember-data';

export default DS.Model.extend({
    source_id: DS.attr('number'),
    target_id: DS.attr('number'),
    code: DS.attr('number'),
    project_id: DS.attr('number'),
});
