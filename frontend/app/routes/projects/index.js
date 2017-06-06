import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        //  Projects are those tasks which have no parent.
        return this.store.query('task', { parent: 0 });
    },

    actions: {
        remove(model) {
            bootbox.confirm({
                message: 'Are you sure you want to delete this project and all its tasks?',
                callback: function(result) {
                    if (result) {
                        model.destroyRecord();
                    }
                }
            });
        }
    }
});
