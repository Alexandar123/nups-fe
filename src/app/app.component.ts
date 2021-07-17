import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from './store/services/data.service';
import { Store, select } from '@ngrx/store';

import { IData } from './models/IAllModels';
import * as UserActions from './store/actions/data-actions';
import * as fromStore from './store/reducers';
import { AuthService } from './auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { tileLayer, latLng, circle, polygon, marker } from 'leaflet';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'geo';
  loadingSpinner: boolean;
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 5,
    center: latLng(46.879966, -121.726909)
  };
  layersControl = {
    baseLayers: {
      'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
      'Open Cycle Map': tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    },
    overlays: {
      'Big Circle': circle([46.95, -122], { radius: 5000 }),
      'Big Square': polygon([[46.8, -121.55], [46.9, -121.55], [46.9, -121.7], [46.8, -121.7]])
    }
  }
  layers = [
    circle([46.95, -122], { radius: 5000 }),
    polygon([[46.8, -121.85], [46.92, -121.92], [46.87, -121.8]]),
    marker([46.879966, -121.726909])
  ];
  layer = circle([ 46.95, -122 ], { radius: 5000 });
  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
  }
  constructor(public data: DataService,
              public store: Store<fromStore.AppState>,
              private auth: AuthService,
              private sanitizer: DomSanitizer) {
                this.store.dispatch(UserActions.getData());
              }


  ngOnInit() { 
    this.store.dispatch(UserActions.GetCitiesFromCountry())
    this.store.dispatch(UserActions.GetYearData())
    this.store.select(fromStore.getLoadingStatus)
    .subscribe(
      (res) => {
        this.loadingSpinner = res
      }
    )
  }
  
  resetData() {
    this.data.getData()
  }


}
