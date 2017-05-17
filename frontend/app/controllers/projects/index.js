import Ember from 'ember';

export default Ember.Controller.extend({
    projects: Ember.computed.alias('model')
});
