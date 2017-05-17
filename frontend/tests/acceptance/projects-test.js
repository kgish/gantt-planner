import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;
var originalConfirm;
var confirmCalledWith;

module('Acceptance: Project', {
  beforeEach: function() {
    application = startApp();
    originalConfirm = window.confirm;
    window.confirm = function() {
      confirmCalledWith = [].slice.call(arguments);
      return true;
    };
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
    window.confirm = originalConfirm;
    confirmCalledWith = null;
  }
});

test('visiting /projects without data', function(assert) {
  visit('/projects');

  andThen(function() {
    assert.equal(currentPath(), 'projects.index');
    assert.equal(find('#blankslate').text().trim(), 'No Projects found');
  });
});

test('visiting /projects with data', function(assert) {
  server.create('projects');
  visit('/projects');

  andThen(function() {
    assert.equal(currentPath(), 'projects.index');
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('create a new projects', function(assert) {
  visit('/projects');
  click('a:contains(New Projects)');

  andThen(function() {
    assert.equal(currentPath(), 'projects.new');

    fillIn('label:contains(Text) input', 'MyString');
    fillIn('label:contains(Start date) input', new Date());
    fillIn('label:contains(Duration) input', 42);
    fillIn('label:contains(Progress) input', 42);

    click('input:submit');
  });

  andThen(function() {
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('update an existing projects', function(assert) {
  server.create('projects');
  visit('/projects');
  click('a:contains(Edit)');

  andThen(function() {
    assert.equal(currentPath(), 'projects.edit');

    fillIn('label:contains(Text) input', 'MyString');
    fillIn('label:contains(Start date) input', new Date());
    fillIn('label:contains(Duration) input', 42);
    fillIn('label:contains(Progress) input', 42);

    click('input:submit');
  });

  andThen(function() {
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('show an existing projects', function(assert) {
  server.create('projects');
  visit('/projects');
  click('a:contains(Show)');

  andThen(function() {
    assert.equal(currentPath(), 'projects.show');

    assert.equal(find('p strong:contains(Text:)').next().text(), 'MyString');
    assert.equal(find('p strong:contains(Start date:)').next().text(), new Date());
    assert.equal(find('p strong:contains(Duration:)').next().text(), 42);
    assert.equal(find('p strong:contains(Progress:)').next().text(), 42);
  });
});

test('delete a projects', function(assert) {
  server.create('projects');
  visit('/projects');
  click('a:contains(Remove)');

  andThen(function() {
    assert.equal(currentPath(), 'projects.index');
    assert.deepEqual(confirmCalledWith, ['Are you sure?']);
    assert.equal(find('#blankslate').length, 1);
  });
});
