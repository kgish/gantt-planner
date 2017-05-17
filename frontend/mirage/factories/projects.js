import { Factory } from 'ember-cli-mirage';

export default Factory.extend(
  {text: 'MyString', startDate: new Date(), duration: 42, progress: 42 }
);
