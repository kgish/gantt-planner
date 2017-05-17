import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        remove: function(model) {
            bootbox.confirm({
                message: 'Are you sure you want to delete this link?',
                callback: function(result) {
                    if (result) {
                        model.destroyRecord();
                    }
                }
            });
        }
    },
    model: function() {
        return this.store.findAll('link');
    }
});
