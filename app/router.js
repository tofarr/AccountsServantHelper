import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('meetings');
  this.route('deposits');
  this.route('outgoing-cheques');
  this.route('incoming-transfers');
  this.route('wefts');
  this.route('s26');
  this.route('s30');
  this.route('settings');
  this.route('s26-list');
  this.route('s30-list');
  this.route('interests');
  this.route('interest-payments');
});

export default Router;
