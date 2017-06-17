import { Component, OnInit } from '@angular/core';
import { MdSidenav } from '@angular/material';
import * as decode from 'jwt-decode';

import template from './app.component.html';
import styles from './app.component.scss';

enum State {
  SignIn, Dashboard, Inventory, Conventions
}

@Component({
  selector: 'con-artist',
  template: template,
  styles: [ styles ],
})
export default class AppComponent implements OnInit {
  State = State;

  state = State.SignIn;
  sidenav: MdSidenav;

  ngOnInit() {
    // if the token exists and has not expired, skip sign in page
    const token = localStorage.getItem('authtoken');
    if(!token) { return; }
    const { exp } = decode(token);
    if(new Date(exp * 1000) < new Date()) { return; }
    this.state = State.Dashboard
  }
}
