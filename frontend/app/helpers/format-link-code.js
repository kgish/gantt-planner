import Ember from 'ember';

export function formatLinkCode(params) {
    let n = parseInt(params[0]);

    if (n < 0 || n > 3) {
        return 'invalid (' + n + ')'
    }

    return ['finish to start', 'start to start', 'finish to finish', 'start to finish' ][n];
}

export default Ember.Helper.helper(formatLinkCode);
