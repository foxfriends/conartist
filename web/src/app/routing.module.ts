import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignInComponent } from './sign-in/sign-in.module';
import { DashboardComponent } from './dashboard/dashboard.module';
import { InventoryComponent } from './inventory/inventory.module';
import { ConventionsComponent } from './conventions/conventions.module';

import AuthGuard from './auth-guard.service';

@NgModule({
  imports: [ RouterModule.forRoot(RoutingModule.routes) ],
  exports: [ RouterModule ],
  providers: [ AuthGuard ]
})
export default class RoutingModule {
  static routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [ AuthGuard ] },
    { path: 'inventory', component: InventoryComponent, canActivate: [ AuthGuard ] },
    { path: 'conventions', component: ConventionsComponent, canActivate: [ AuthGuard ] },
    { path: 'sign-in', component: SignInComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/sign-in' },
  ];
}
