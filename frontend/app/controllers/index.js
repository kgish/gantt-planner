import Ember from 'ember';

export default Ember.Controller.extend({
    tasks: Ember.computed.alias('model')
});
