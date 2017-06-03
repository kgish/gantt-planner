import Ember from 'ember';

export function formatDuration(params/*, hash*/) {
    let duration = parseInt(params[0]);
    return duration + ' day' + (duration === 1 ? '' : 's');
}

export default Ember.Helper.helper(formatDuration);
