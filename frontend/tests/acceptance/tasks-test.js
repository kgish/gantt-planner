import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;
var originalConfirm;
var confirmCalledWith;

module('Acceptance: Task', {
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

test('visiting /tasks without data', function(assert) {
  visit('/tasks');

  andThen(function() {
    assert.equal(currentPath(), 'tasks.index');
    assert.equal(find('#blankslate').text().trim(), 'No Tasks found');
  });
});

test('visiting /tasks with data', function(assert) {
  server.create('task');
  visit('/tasks');

  andThen(function() {
    assert.equal(currentPath(), 'tasks.index');
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('create a new task', function(assert) {
  visit('/tasks');
  click('a:contains(New Task)');

  andThen(function() {
    assert.equal(currentPath(), 'tasks.new');

    fillIn('label:contains(Text) input', 'MyString');
    fillIn('label:contains(Start date) input', new Date());
    fillIn('label:contains(Duration) input', 'MyString');
    fillIn('label:contains(Progress) input', 'MyString');
    fillIn('label:contains() input', 'MyString');

    click('input:submit');
  });

  andThen(function() {
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('update an existing task', function(assert) {
  server.create('task');
  visit('/tasks');
  click('a:contains(Edit)');

  andThen(function() {
    assert.equal(currentPath(), 'tasks.edit');

    fillIn('label:contains(Text) input', 'MyString');
    fillIn('label:contains(Start date) input', new Date());
    fillIn('label:contains(Duration) input', 'MyString');
    fillIn('label:contains(Progress) input', 'MyString');
    fillIn('label:contains() input', 'MyString');

    click('input:submit');
  });

  andThen(function() {
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('show an existing task', function(assert) {
  server.create('task');
  visit('/tasks');
  click('a:contains(Show)');

  andThen(function() {
    assert.equal(currentPath(), 'tasks.show');

    assert.equal(find('p strong:contains(Text:)').next().text(), 'MyString');
    assert.equal(find('p strong:contains(Start date:)').next().text(), new Date());
    assert.equal(find('p strong:contains(Duration:)').next().text(), 'MyString');
    assert.equal(find('p strong:contains(Progress:)').next().text(), 'MyString');
    assert.equal(find('p strong:contains(:)').next().text(), 'MyString');
  });
});

test('delete a task', function(assert) {
  server.create('task');
  visit('/tasks');
  click('a:contains(Remove)');

  andThen(function() {
    assert.equal(currentPath(), 'tasks.index');
    assert.deepEqual(confirmCalledWith, ['Are you sure?']);
    assert.equal(find('#blankslate').length, 1);
  });
});
