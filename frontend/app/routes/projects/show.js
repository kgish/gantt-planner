import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.get('store').findRecord('project', params.project_id);
    },

    setupController(controller, model){
        let result = this._super(controller, model);

        this.get('store').query('task', { project: model.get('id') }).then(
            function(tasks) {
                controller.set('tasks', tasks);
            }
        );

        this.get('store').query('link', { project: model.get('id') }).then(
            function(links) {
                controller.set('links', links);
            }
        );

        return result;
    }
});
