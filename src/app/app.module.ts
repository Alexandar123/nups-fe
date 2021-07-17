import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainWindowComponent } from './layout/search-area/main-window/main-window.component';
import { MatGridListModule, MatButtonModule, MatInputModule, MatMenuModule, MatIconModule, MatDialogModule, MatProgressSpinner, MatProgressSpinnerModule, MatTooltipModule, MatTableModule, MatDatepickerInput, MatDatepickerModule, MatSortModule, MatPaginator, MatPaginatorModule, MatSelectModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import * as dataReducer from '../app/store/reducers/data-reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { DataEffects } from './store/effects/data.effects';
import { GeoDbFreeModule } from 'wft-geodb-angular-client';
import { NavBarComponent } from './auth/nav-bar/nav-bar.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { LoginComponent } from './auth/login/login.component';
import { FilterModalComponent } from './auth/nav-bar/filter-modal/filter-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { MoreInfoComponent } from './auth/nav-bar/more-info/more-info.component';
import { AdminComponent } from './auth/admin/admin.component';
import { ToastrModule } from 'ngx-toastr';
import { AdminModalComponent } from './auth/admin/admin-modal/admin-modal.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';
import { MainWrapComponent } from './layout/navigation/main-wrap/main-wrap.component';
import { GraphsComponent } from './layout/navigation/graphs/graphs.component';
import { TablesComponent } from './layout/navigation/tables/tables.component';
import { FilterModule } from './layout/search-area/filters/filter.module';
import { UsersTabComponent } from './auth/admin/users-tab/users-tab.component';
import { AddsTabComponent } from './auth/admin/adds-tab/adds-tab.component';

import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  declarations: [
    AppComponent,
    MainWindowComponent,
    NavBarComponent,
    LoginComponent,
    FilterModalComponent,
    MoreInfoComponent,
    AdminComponent,
    AdminModalComponent,
    MainWrapComponent,
    GraphsComponent,
    TablesComponent,
    UsersTabComponent,
    AddsTabComponent,
  ],
  imports: [
    BrowserModule,
    FilterModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    HttpClientModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatDatepickerModule,
    PaginationModule.forRoot(),
    StoreModule.forRoot({data: dataReducer.reducer}),
    // StoreDevtoolsModule.instrument({
    //   maxAge: 50
    // }),
    EffectsModule.forRoot([DataEffects]),
    GeoDbFreeModule.forRoot({
      apiKey: null,
      serviceUri: 'http://geodb-free-service.wirefreethought.com'
    })
    ,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDeir6Xl6iK7FlpWI_mriVCQ4hOgy9E1_c',
      libraries: ["places", "geometry"]
  }),

    MatInputModule,
    AngularFontAwesomeModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ToastrModule.forRoot(),
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    LeafletMarkerClusterModule.forRoot()
  ],
  entryComponents: [
    FilterModalComponent,
    MoreInfoComponent,
    AdminModalComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
