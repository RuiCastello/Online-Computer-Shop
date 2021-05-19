import { CapFirstLetterStringPipe } from './cap-first-letter-string.pipe';

describe('CapFirstLetterStringPipe', () => {
  it('create an instance', () => {
    const pipe = new CapFirstLetterStringPipe();
    expect(pipe).toBeTruthy();
  });
});
