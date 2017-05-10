import Ember from 'ember';

export default Ember.Controller.extend({
    tasks: Ember.computed.alias('model'),
    scale_units: ['day', 'week', 'quarter', 'month', 'year']
});
