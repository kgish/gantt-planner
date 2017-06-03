import Ember from 'ember';

export function formatProgress(params/*, hash*/) {
    let progress = 100 * params[0];
    progress = progress.toFixed(2);
    progress = progress.replace(/0$/,'');
    progress = progress.replace(/\.0$/,'');
    return progress + '%';
}

export default Ember.Helper.helper(formatProgress);
