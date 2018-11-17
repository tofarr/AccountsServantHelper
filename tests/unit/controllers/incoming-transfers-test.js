import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | incoming-transfers', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:incoming-transfers');
    assert.ok(controller);
  });
});
