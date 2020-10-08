import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

import { PlaceCreateComponent } from './places/place-create/place-create.component';
import { PlaceEditComponent } from './places/place-edit/place-edit.component';
import { PlaceListComponent } from './places/place-list/place-list.component';
import { ReportListComponent } from './reports/report-list/report-list.component';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {path: '', component: PlaceListComponent, canActivate: [AuthGuard]},
  // {path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path: 'places/edit/:placeId', component: PlaceEditComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'reports', component: ReportListComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
