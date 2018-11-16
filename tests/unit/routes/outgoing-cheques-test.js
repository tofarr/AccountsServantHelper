import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | outgoing-cheques', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:outgoing-cheques');
    assert.ok(route);
  });
});
