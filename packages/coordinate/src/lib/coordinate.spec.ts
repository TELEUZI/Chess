import { Coordinate } from './coordinate';

describe('coordinate', () => {
  it('should work', () => {
    expect(new Coordinate(1, 2).x).toEqual(1);
  });
});
