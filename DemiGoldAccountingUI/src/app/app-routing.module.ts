import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientOverviewComponent } from './client-overview/client-overview.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'overview', component: ClientOverviewComponent },
  { path: 'transactions/:id', component: ClientDetailComponent},
  { path: '', redirectTo: '/overview', pathMatch: 'full' }
];
@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }
