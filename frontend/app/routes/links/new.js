import Ember from 'ember';
import SaveModelMixin from 'frontend/mixins/links/save-model-mixin';

export default Ember.Route.extend(SaveModelMixin, {
  model: function() {
    return this.store.createRecord('link');
  }
});
