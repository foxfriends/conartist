import { expect } from 'chai';
import ColorPipe from './color.pipe';

type Context = {
  pipe: ColorPipe;
};

describe('Color Pipe', function(this: Mocha.ISuiteCallbackContext & Context) {
  beforeEach('Instantiate the pipe', () => this.pipe = new ColorPipe);
  it('should transform an array of 3 numbers to a hex color', () => {
    expect(this.pipe.transform([255, 255, 255])).to.equal('#ffffff');
    expect(this.pipe.transform([0, 0, 0])).to.equal('#000000');
    expect(this.pipe.transform([125, 38, 203])).to.equal('#7d26cb');
  });
  it('should transform an array of 3 numbers to an RGB color', () => {
    expect(this.pipe.transform([255, 255, 255], 'rgb')).to.equal('rgb(255,255,255)');
    expect(this.pipe.transform([0, 0, 0], 'rgb')).to.equal('rgb(0,0,0)');
    expect(this.pipe.transform([125, 38, 203], 'rgb')).to.equal('rgb(125,38,203)');
  });
  it('should transform an array of 4 numbers to a hex RGBA color', () => {
    expect(this.pipe.transform([255, 255, 255, 0.5])).to.equal('rgba(#ffffff,0.5)');
    expect(this.pipe.transform([0, 0, 0, 0.2])).to.equal('rgba(#000000,0.2)');
    expect(this.pipe.transform([125, 38, 203, 0.8])).to.equal('rgba(#7d26cb,0.8)');
  });
  it('should transform an array of 4 numbers to a RGBA color', () => {
    expect(this.pipe.transform([255, 255, 255, 0.5], 'rgb')).to.equal('rgba(255,255,255,0.5)');
    expect(this.pipe.transform([0, 0, 0, 0.2], 'rgb')).to.equal('rgba(0,0,0,0.2)');
    expect(this.pipe.transform([125, 38, 203, 0.8], 'rgb')).to.equal('rgba(125,38,203,0.8)');
  });
  it('should not output an RGBA color with alpha 1', () => {
    expect(this.pipe.transform([255, 255, 255, 1])).to.equal('#ffffff');
  });
});
