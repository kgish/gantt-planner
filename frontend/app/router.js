import Ember from 'ember';
import config from 'frontend/config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function() {

  this.route('tasks', function() {
      this.route('new');

      this.route('edit', {
          path: ':task_id/edit'
      });

      this.route('show', {
          path: ':task_id'
      });
  });

  this.route('links', function() {
      this.route('new');

      this.route('edit', {
          path: ':link_id/edit'
      });

      this.route('show', {
          path: ':link_id'
      });
  });

  this.route('projects', function() {
    this.route('new');

    this.route('edit', {
      path: ':task_id/edit'
    });

    this.route('show', {
      path: ':task_id'
    });
  });

});

export default Router;
