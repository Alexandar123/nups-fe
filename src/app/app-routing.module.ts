import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainWindowComponent } from './layout/search-area/main-window/main-window.component';
import { AppComponent } from './app.component';
import { AdminComponent } from './auth/admin/admin.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { MainWrapComponent } from './layout/navigation/main-wrap/main-wrap.component';
import { GraphsComponent } from './layout/navigation/graphs/graphs.component';
import { TablesComponent } from './layout/navigation/tables/tables.component';
import { MapComponent } from './layout/search-area/filters/map/map.component';


const routes: Routes = [
  { path: 'logout', component: MainWindowComponent },
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuardService] },
  {path: 'main', component: MainWindowComponent},
  { path: '', component: MainWindowComponent },
  { path: '**', component: MainWindowComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
