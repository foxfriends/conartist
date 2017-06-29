import { expect } from 'chai';

import ColorPipe from './color.pipe';

type Context = {
  pipe: ColorPipe;
};

describe('Color Pipe', function(this: Mocha.ISuiteCallbackContext & Context) {
  beforeEach('Instantiate the pipe', () => this.pipe = new ColorPipe);
  it('should a 3 byte number to a hex color', () => {
    expect(this.pipe.transform(0xFFFFFF)).to.equal('#ffffff');
    expect(this.pipe.transform(0)).to.equal('#000000');
    expect(this.pipe.transform(0x7d26cb)).to.equal('#7d26cb');
  });
  it('should a 3 byte number to an RGB color', () => {
    expect(this.pipe.transform(0xFFFFFF, 'rgb')).to.equal('rgb(255,255,255)');
    expect(this.pipe.transform(0, 'rgb')).to.equal('rgb(0,0,0)');
    expect(this.pipe.transform(0x7d26cb, 'rgb')).to.equal('rgb(125,38,203)');
  });
  it('should a 4 byte number to a hex RGBA color', () => {
    expect(this.pipe.transform(0x7EFFFFFF)).to.equal('rgba(#ffffff,0.5)');
    expect(this.pipe.transform(0x33000000)).to.equal('rgba(#000000,0.2)');
    expect(this.pipe.transform(0xCC7d26cb)).to.equal('rgba(#7d26cb,0.8)');
  });
  it('should a 4 byte number to an RGBA color', () => {
    expect(this.pipe.transform(0x7EFFFFFF, 'rgb')).to.equal('rgba(255,255,255,0.5)');
    expect(this.pipe.transform(0x33000000, 'rgb')).to.equal('rgba(0,0,0,0.2)');
    expect(this.pipe.transform(0xCC7d26cb, 'rgb')).to.equal('rgba(125,38,203,0.8)');
  });
  it('should not output a color with alpha 1', () => {
    expect(this.pipe.transform(0xFFFFFFFF)).to.equal('#ffffff');
    expect(this.pipe.transform(0xFFFFFFFF, 'rgb')).to.equal('rgb(255,255,255)');
  });
});
