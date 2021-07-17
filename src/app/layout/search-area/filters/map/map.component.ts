import { Component, OnInit, Input, ViewChild, ElementRef, Output, AfterViewInit, Renderer2 } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IData } from 'src/app/models/IAllModels';
import * as UserActions from '../../../../store/actions/data-actions';
import * as fromStore from '../../../../store/reducers';
import { AgmCircle, AgmMap } from '@agm/core';
import { EventEmitter } from 'events';
import { tileLayer, latLng, circle, polygon, marker } from 'leaflet';
declare var ol: any;
// import * as L from 'leaflet';
import { ApiService } from 'src/app/store/services/api.service';
import 'leaflet-easyprint';
import * as L from 'leaflet';
import 'leaflet.markercluster';

import { MapService } from 'src/app/store/services/map.service';
import { DataService } from 'src/app/store/services/data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() name: any;
  // @ViewChild('map', { static: true }) map: ElementRef;
  @ViewChild('circle', { static: true }) circle: AgmCircle;
  @Output() valueChange = new EventEmitter();

  @Input('data') set setData(done) {

  }
  private map;

  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData: L.Marker[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions;

  lat = 44.7881181;
  long = 20.4415257;
  range = 10;
  mapType = 'satellite';
  mapOptions = {
    scrollwheel: null,
    disableDoubleClickZoom: true,
    panControl: false,
    streetViewControl: false
  };
  markers = [];
  marks = [];
  tempAdds = [];
  tempMap = [];
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 12,
    center: latLng(44.7881181, 20.4415257),
    preferCanvas: true,
    drawControl: false
  };
  drawOptions = {
    position: 'topright',
    draw: {
      marker: false,
      polyline: false,
      circle: false,
      circlemarker: false,
      rectangle: false,
    },
    edit: {
      edit: false,
      toolbar: {
        actions: {
          save: {
            title: 'Save changes',
            text: 'Save'
          },
          cancel: {
            title: 'Cancel editing, discards all changes',
            text: 'Cancel'
          },
          clearAll: {
            title: 'Clear all layers',
            text: 'Clear All'
          }
        },
        buttons: {
          edit: 'Edit layers',
          editDisabled: 'No layers to edit',
          remove: 'Delete layers',
          removeDisabled: 'No layers to delete'
        }
      }
    }
  };
  layers = [];
  sameMarkers: Array<any>;
  polygonActive: boolean;
  polygonLayers = [];
  constructor(
    private store: Store<fromStore.AppState>,
    private data: DataService,
    private render: Renderer2,
    private elem: ElementRef,
    private mapService: MapService,
    private api: ApiService) {
    this.data.checkRoute()


    this.store.select(fromStore.selectTemp)
      .subscribe(
        (res) => {
          if (res != undefined && res.length > 0) {
            this.tempAdds = JSON.parse(JSON.stringify(res));
            let done = this.mapService.checkCircle(this.tempAdds);
            this.layers = done.layer;
            this.sameMarkers = done.same;
            this.store.dispatch(UserActions.SetAddsData({ payload: this.data.deepCopy(this.tempAdds) }))
            this.mapService.screenShotMap();

          }
        }
      )

    this.store.select(fromStore.getLocationProps)
      .subscribe(
        (res) => {
          if (res != undefined) {
            let layer = circle([46.95, -122], { radius: 5000 });
          }
        }
      )
    this.store.select(fromStore.GetActiveAdds)
      .subscribe(
        (res) => {
          if (res != null && res.length > 0) {
            this.tempAdds = JSON.parse(JSON.stringify(res));
            this.setMainTown({ lat: this.tempAdds[0].lat, lon: this.tempAdds[0].lon })
            let done = this.mapService.checkCircle(this.tempAdds);
            this.layers = done.layer;
            this.sameMarkers = done.same;
            this.mapService.screenShotMap();
          }
        }
      )

    this.store.select(fromStore.getMainLocation)
      .subscribe(
        (res) => {
          if (res != null) {
            this.setMainTown({ lat: res.y, lon: res.x })
          }
        }
      )
    this.data.newSearch$.subscribe((res) => {
      if (res) {
        this.deletePolygon()
      }
    })
  }

  ngAfterViewInit() {
    let scope = this;
    this.map.on('draw:created', function (draw) {
      scope.checkMarkersAfterDraw(draw);
      draw.layer.bringToBack()
      scope.polygonActive = true;
      scope.mapService.polygonStatus$.next(true);
      scope.polygonLayers.push(draw.layer);
    })
    this.map.on('draw:deletestop', function (draw) {
      scope.polygonActive = false;
      let done = scope.mapService.checkCircle(scope.tempAdds);
      scope.layers = done.layer;
      scope.sameMarkers = done.same;
      scope.store.dispatch(UserActions.SetAddsData({ payload: scope.data.deepCopy(scope.tempAdds) }))
      scope.mapService.polygonStatus$.next(false);
    });

    let legend = new L.Control({ position: 'bottomleft' });
    legend.onAdd = function (map) {
      let div = L.DomUtil.create('div', 'info legend');
      let grades = ['1', '>1'];
      div.innerHTML += '<div><i style="background: #3388ff"></i><span class="legend-name">Jedinstven oglas</span></div><br>';
      div.innerHTML += '<div><i style="background: #ff6347"></i><span class="legend-name">Više oglasa</span></div>';
      return div;
    };
    legend.addTo(this.map);
    (L as any).easyPrint({
      title: 'My awesome print button',
      hidden: true,
      outputFormat: 'png'
  }).addTo(this.map);
  }
  selectedMarker;

  setMainTown(add) {
    this.map.panTo(new L.LatLng(add.lat, add.lon));
  }

  selectMarker(event, window) {
    window.open()
    this.selectedMarker = {
      lat: event.latitude,
      lon: event.longitude
    };
  }

  ngOnInit() {

  }
  setMapWidth(template): any {
    let props = template.offsetParent.clientHeight;
    props = props - 35;
    return props;
  }

  getLocation(ev) {
    // console.log(ev)
  }

  setMarker(mark) {
    let place = '';
    if (mark.times > 0) {
      place = '*';
    } else {
      place = mark.mark.id_ad;
    }
    return place;
  }



  checkMarkersAfterDraw(polygon) {
    const len = this.layers.length;
    let tempAdds = this.data.deepCopy(this.tempAdds)
    for (let i = 0; i < len; i++) {
      const inside = this.mapService.isMarkerInsidePolygon(this.layers[i], polygon);
      if (!inside) {
        tempAdds = this.checkDuplacated(i, tempAdds)
        this.map.removeLayer(this.layers[i]);
      }
    }
    this.store.dispatch(UserActions.SetAddsData({ payload: tempAdds }))
  }

  checkDuplacated(index, adds: Array<any>) {
    if (this.sameMarkers[index].times.length > 0) {
      let tempArr = this.sameMarkers[index].times;
      let mainMark = this.sameMarkers[index].mark.id_ad;
      for (let i = 0; i < adds.length; i++) {
        tempArr.forEach(element => {
          if (adds[i].id_ad == element.times) {
            adds.splice(i, 1);
            return;
          }
        });
        if (adds[i] != undefined && adds[i].id_ad == mainMark) {
          adds.splice(i, 1);
          i--;
        }
      }
    } else {
      for (let i = 0; i < adds.length; i++) {
        if (adds[i] != undefined && adds[i].id_ad == this.sameMarkers[index].mark.id_ad) {
          adds.splice(i, 1);
        }
      }
    }
    return adds;
  }

  drawCreated(event) {
    this.map = event;
  }

  markerClusterReady(group: L.MarkerClusterGroup) {
    this.markerClusterGroup = group;
  }

  deletePolygon () {
    for (let i = 0; i < this.polygonLayers.length;i ++) {
      this.map.removeLayer(this.polygonLayers[i]);
    }
    this.polygonActive = false;
    let done = this.mapService.checkCircle(this.tempAdds);
    this.layers = done.layer;
    this.sameMarkers = done.same;
    this.store.dispatch(UserActions.SetAddsData({ payload: this.data.deepCopy(this.tempAdds) }))
    this.mapService.polygonStatus$.next(false);
  }

}
