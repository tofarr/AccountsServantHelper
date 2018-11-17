import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | outgoing-cheques', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:outgoing-cheques');
    assert.ok(controller);
  });
});
