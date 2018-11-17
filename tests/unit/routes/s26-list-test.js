import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | s26-list', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:s26-list');
    assert.ok(route);
  });
});
