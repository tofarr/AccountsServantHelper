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
  this.route('interest-payments');
  this.route('dropbox');
  this.route('backup');
  this.route('reports');
  this.route('statement');
  this.route('to62');
});

export default Router;
