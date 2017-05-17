import DS from 'ember-data';

export default DS.Model.extend({
    task_id: DS.attr('number'),
    text: DS.attr('string'),
    start_date: DS.attr('date'),
    duration: DS.attr('number'),
    progress: DS.attr('number'),
    parent_id: DS.attr('number'),
    project_id: DS.attr('number')
});
