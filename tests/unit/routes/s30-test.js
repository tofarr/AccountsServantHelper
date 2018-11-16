import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | s30', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:s30');
    assert.ok(route);
  });
});
