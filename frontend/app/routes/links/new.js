import Ember from 'ember';
import SaveModelMixin from 'frontend/mixins/links/save-model-mixin';

export default Ember.Route.extend(SaveModelMixin, {
    model() {
        return this.store.createRecord('link');
    }
});
