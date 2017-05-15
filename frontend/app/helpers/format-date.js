import Ember from 'ember';

export function formatDate(d) {
  return moment(d[0]).format('ddd DD MMM YYYY');
}

export default Ember.Helper.helper(formatDate);
