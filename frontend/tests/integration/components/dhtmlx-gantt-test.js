import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('dhtmlx-gantt', 'Integration | Component | dhtmlx gantt', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{dhtmlx-gantt}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#dhtmlx-gantt}}
      template block text
    {{/dhtmlx-gantt}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
