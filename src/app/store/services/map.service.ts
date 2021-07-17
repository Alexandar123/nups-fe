import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import * as L from 'leaflet';
import domtoimage from 'dom-to-image';
import * as UserActions from '../actions/data-actions';
import * as fromStore from '../reducers';
import { Store } from '@ngrx/store';
import { Subject, ReplaySubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MapService {

  polygonStatus$: Subject<boolean> = new ReplaySubject<boolean>(null);

  constructor(private data: DataService,
              private store: Store<fromStore.AppState>) { }

  checkCircle(adds) {
    let layers = []
    const marks = this.checkSameMarkers(adds);
    for (let i = 0; i < marks.length; i++) {
        let layer;
        let ids = '';
        if (marks[i].times.length > 0) {
          layer = L.circleMarker([marks[i].mark.lat, marks[i].mark.lon], { color: '#ff6347' })
          marks[i].times.forEach(element => {
            ids = ids.concat(' ', element.times)
          });
        } else {
          layer = L.circleMarker([marks[i].mark.lat, marks[i].mark.lon], { color: '#3388ff' })
          ids = JSON.stringify(marks[i].mark.id_ad)
        }
        layer.bindTooltip(ids).openTooltip();
        layers.push(layer);
    }
    return {layer: layers, same: marks};
  }

  checkSameMarkers(markers) {
    let newMarkers = []
    let marks = this.data.deepCopy(markers);
    for (let i = 0; i < marks.length; i++) {
      let ids = [];
      let currMarker = marks[i];
      let y;
      for (y = 0; y < marks.length; y++) {
        let nextMarker = marks[y];
        if (currMarker.id_ad != nextMarker.id_ad && currMarker.lat == nextMarker.lat && currMarker.lon == nextMarker.lon) {
          ids.push({ times: nextMarker.id_ad })
          marks.splice(y, 1);
          y--;
        }
      }
      y = 0;
      let more;
      if (ids.length > 0) {
        more = '*';
      }
      newMarkers.push(
        {
          mark: currMarker,
          times: ids,
          more: more
        }
      )
    }
    return newMarkers;
  }


  isMarkerInsidePolygon(marker, poly) {
    var polyPoints = poly.layer.getLatLngs();
    polyPoints = polyPoints[0]
    var x = marker.getLatLng().lat, y = marker.getLatLng().lng;

    var inside = false;
    for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
      var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
      var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

      var intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  }

  screenShotMap(): any {
    let html = <HTMLCanvasElement>document.getElementById('map')
    domtoimage.toPng(html).then( (dataUrl) => {
        // let parser = new DOMParser();
        // let parsedHtml = parser.parseFromString(text, 'text/html');
        // let html = parsedHtml.body.outerHTML;
        // let url = 'data:application/vnd.ms-word,' + escape(html);
        const graph = {
          origin: 'Map screenshot',
          graph: dataUrl,
          desc: 'Map screenshot'
        };
        this.store.dispatch(UserActions.CheckScreenShot({ payload: graph }))
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
  }
}
