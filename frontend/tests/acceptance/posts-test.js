import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;
var originalConfirm;
var confirmCalledWith;

module('Acceptance: Post', {
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

test('visiting /posts without data', function(assert) {
  visit('/posts');

  andThen(function() {
    assert.equal(currentPath(), 'posts.index');
    assert.equal(find('#blankslate').text().trim(), 'No Posts found');
  });
});

test('visiting /posts with data', function(assert) {
  server.create('post');
  visit('/posts');

  andThen(function() {
    assert.equal(currentPath(), 'posts.index');
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('create a new post', function(assert) {
  visit('/posts');
  click('a:contains(New Post)');

  andThen(function() {
    assert.equal(currentPath(), 'posts.new');


    click('input:submit');
  });

  andThen(function() {
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('update an existing post', function(assert) {
  server.create('post');
  visit('/posts');
  click('a:contains(Edit)');

  andThen(function() {
    assert.equal(currentPath(), 'posts.edit');


    click('input:submit');
  });

  andThen(function() {
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('show an existing post', function(assert) {
  server.create('post');
  visit('/posts');
  click('a:contains(Show)');

  andThen(function() {
    assert.equal(currentPath(), 'posts.show');

  });
});

test('delete a post', function(assert) {
  server.create('post');
  visit('/posts');
  click('a:contains(Remove)');

  andThen(function() {
    assert.equal(currentPath(), 'posts.index');
    assert.deepEqual(confirmCalledWith, ['Are you sure?']);
    assert.equal(find('#blankslate').length, 1);
  });
});
