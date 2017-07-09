import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignInComponent } from '../sign-in/sign-in.module';
import { DashboardComponent } from '../dashboard/dashboard.module';
import { InventoryComponent } from '../inventory/inventory.module';
import ConventionsComponent from '../conventions/conventions.component';
import ConInfoComponent from '../conventions/con-info.component';
import ConListComponent from '../conventions/con-list.component';

import ConventionResolver from './convention-resolver';
import AuthGuard from './auth-guard';
import UnauthGuard from './unauth-guard';

@NgModule({
  imports: [ RouterModule.forRoot(RoutingModule.routes) ],
  exports: [ RouterModule ],
  providers: [ AuthGuard, UnauthGuard, ConventionResolver ]
})
export default class RoutingModule {
  static routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [ AuthGuard ] },
    { path: 'inventory', component: InventoryComponent, canActivate: [ AuthGuard ] },
    { path: 'conventions', component: ConventionsComponent, canActivate: [ AuthGuard ], children: [
      { path: '', children: [
        { path: ':code', component: ConInfoComponent, resolve: { convention: ConventionResolver } },
        { path: '', component: ConListComponent },
      ]},
    ]},
    { path: 'sign-in', component: SignInComponent, canActivate: [ UnauthGuard ] },
    { path: '', redirectTo: '/sign-in', pathMatch: 'full', canActivate: [ UnauthGuard ] },
    { path: '**', redirectTo: '/sign-in', canActivate: [ UnauthGuard ] },
  ];
}