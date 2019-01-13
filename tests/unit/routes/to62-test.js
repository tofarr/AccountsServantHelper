import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | to62', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:to62');
    assert.ok(route);
  });
});
