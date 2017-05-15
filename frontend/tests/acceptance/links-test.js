import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;
var originalConfirm;
var confirmCalledWith;

module('Acceptance: Link', {
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

test('visiting /links without data', function(assert) {
  visit('/links');

  andThen(function() {
    assert.equal(currentPath(), 'links.index');
    assert.equal(find('#blankslate').text().trim(), 'No Links found');
  });
});

test('visiting /links with data', function(assert) {
  server.create('link');
  visit('/links');

  andThen(function() {
    assert.equal(currentPath(), 'links.index');
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('create a new link', function(assert) {
  visit('/links');
  click('a:contains(New Link)');

  andThen(function() {
    assert.equal(currentPath(), 'links.new');

    fillIn('label:contains(Source) input', 'MyString');
    fillIn('label:contains(Target) input', 42);
    fillIn('label:contains( type) input', 42);

    click('input:submit');
  });

  andThen(function() {
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('update an existing link', function(assert) {
  server.create('link');
  visit('/links');
  click('a:contains(Edit)');

  andThen(function() {
    assert.equal(currentPath(), 'links.edit');

    fillIn('label:contains(Source) input', 'MyString');
    fillIn('label:contains(Target) input', 42);
    fillIn('label:contains( type) input', 42);

    click('input:submit');
  });

  andThen(function() {
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('show an existing link', function(assert) {
  server.create('link');
  visit('/links');
  click('a:contains(Show)');

  andThen(function() {
    assert.equal(currentPath(), 'links.show');

    assert.equal(find('p strong:contains(Source:)').next().text(), 'MyString');
    assert.equal(find('p strong:contains(Target:)').next().text(), 42);
    assert.equal(find('p strong:contains( type:)').next().text(), 42);
  });
});

test('delete a link', function(assert) {
  server.create('link');
  visit('/links');
  click('a:contains(Remove)');

  andThen(function() {
    assert.equal(currentPath(), 'links.index');
    assert.deepEqual(confirmCalledWith, ['Are you sure?']);
    assert.equal(find('#blankslate').length, 1);
  });
});
