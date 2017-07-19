import { Injectable } from '@angular/core';

@Injectable()
export class HelpService {
  private _visible = false;
  get visible() {
    return this._visible;
  }
  show(): void {
    this._visible = true;
  }
  hide(): void {
    this._visible = false;
  }
  toggle(): void {
    this._visible = !this._visible;
  }
}
