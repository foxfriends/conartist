import { Component, OnInit } from '@angular/core';
import * as decode from 'jwt-decode';

import template from './app.component.html';
import styles from './app.component.scss';

@Component({
  selector: 'con-artist',
  template: template,
  styles: [ styles ],
})
export default class AppComponent implements OnInit {
  title = 'Con Artist';
  signedIn = false;

  ngOnInit() {
    // if the token exists and has not expired, skip sign in page
    const token = localStorage.getItem('authtoken');
    if(!token) { return; }
    const { exp } = decode(token);
    if(new Date(exp * 1000) < new Date()) { return; }
    this.signedIn = true;
  }
}
