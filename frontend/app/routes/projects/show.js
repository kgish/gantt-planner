import Ember from 'ember';

export default Ember.Route.extend({
    model: function(params) {
        return this.get('store').findRecord('project', params.project_id);
    },

    setupController(controller, model){
        this._super(controller, model);
        this.get('store').query('task', {filter: {parent: model.get('id')}}).then(
            function(tasks) {
                controller.set('tasks', tasks);
            }
        );
    }
});
