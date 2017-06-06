import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store.findAll('link');
    },

    afterModel(model) {
        model.forEach(link => {
           this.store.findRecord('project', link.get('project')).then(
               project => { console.log(project.get('text')); }
           );
        });
    },

    actions: {
        remove(model) {
            bootbox.confirm({
                message: 'Are you sure you want to delete this link?',
                callback: function(result) {
                    if (result) {
                        model.destroyRecord();
                    }
                }
            });
        }
    }
});
