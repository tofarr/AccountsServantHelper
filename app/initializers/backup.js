export function initialize(application) {
  application.inject('route', 'application', 'service:backup')
}

export default {
  initialize
};
