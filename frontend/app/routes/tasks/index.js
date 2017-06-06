import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        //  Tasks are those tasks which have a parent.
        return this.store.query('task', { not: { parent: 0 } } );
    },

    actions: {
        remove(model) {
            bootbox.confirm({
                message: 'Are you sure you want to delete this task?',
                callback: function(result) {
                    if (result) {
                        model.destroyRecord();
                    }
                }
            });
        }
    }
});
