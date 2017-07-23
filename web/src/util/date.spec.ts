import { expect } from 'chai';
import { startOfDay, endOfDay } from './date';

describe('#startOfDay', function() {
  // TODO: timezones make this weird. is there a better way?
  it('should return a date corresponding to the start of the day', () => {
    const date = new Date('2017-07-23T21:06:16.699Z');
    const adjusted = new Date(date);
    adjusted.setHours(0, 0, 0, 0);
    expect(startOfDay(date).getTime()).to.equal(adjusted.getTime());
  });
});

describe('#endOfDay', function() {
  it('should return a date corresponding to the start of the day', () => {
    const date = new Date('2017-07-23T21:06:16.699Z');
    const adjusted = new Date(date);
    adjusted.setHours(23, 59, 59, 999);
    expect(endOfDay(date).getTime()).to.equal(adjusted.getTime());
  });
});
