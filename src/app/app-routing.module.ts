import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { LoginComponent } from 'src/app/components/login/login.component';
import { HomeComponent } from 'src/app/components/home/home.component';

// canActivate: [AuthGuard],
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent},
  { path: '**', redirectTo: 'home',  pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
