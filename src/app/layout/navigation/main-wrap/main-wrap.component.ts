import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MainService } from 'src/app/store/services/main.service';
import { DataService } from 'src/app/store/services/data.service';
import { MatDialog } from '@angular/material';
import { LocationModalComponent } from '../../search-area/filters/location-modal/location-modal.component';
import { MapService } from 'src/app/store/services/map.service';
import { GraphService } from 'src/app/store/services/graph.service';

@Component({
  selector: 'app-main-wrap',
  templateUrl: './main-wrap.component.html',
  styleUrls: ['./main-wrap.component.scss']
})
export class MainWrapComponent implements OnInit, OnDestroy {

  constructor(public main: MainService,
    public graph: GraphService,
    public map: MapService,
    public dom: ElementRef,
    public dialog: MatDialog,
    public data: DataService) { }

  listingBreakpoint;
  searchBreakpoint;
  mapBreakpoint;
  graphBreakpoint;

  mainListing = 'Broj oglašenih nekretnina prema zadatim podacima';
  averageListing = 'Prosečna cena prema zadatim podacima';
  meadianListing = 'Medijan cena prema zadatim podacima';
  

  addType: string;
  ngOnInit() {
    if (window.innerWidth <= 400) {

    } else {
      this.listingBreakpoint = 3;
      this.searchBreakpoint = 9;
      this.mapBreakpoint = 9;
      this.graphBreakpoint = 6;
    }
    this.data.checkRoute();

    this.graph.chosedAddOrigin$.subscribe(
      (res) => {
        this.addType = res;
        // this.changeNames()
      }
    )
    this.map.polygonStatus$.subscribe(
      (res) => {
          // this.changeNames(res)
      }
    )
  }

  windowAdapt() {
  }

  openInfo() {
    const dialogRef = this.dialog.open(LocationModalComponent, {
      width: '450px',
      data: { origin: 'location' }
    });
  }

  ngOnDestroy () {
    // this.map.polygonStatus$.unsubscribe()
  }

  changeNames(status?) {
    if (status) {
      this.mainListing = 'Broj oglašenih nekretnina prema zadatim podacima i za zadati poligon';
      this.averageListing =  'Prosečna ' + this.addType + ' cena prema zadatim podacima i za zadati poligon';
      this.meadianListing = 'Medijan ' + this.addType + ' cena prema zadatim podacima i za zadati poligon';
    } else {
      this.mainListing = 'Broj oglašenih nekretnina prema zadatim podacima';
      this.averageListing = "Prosečna " + this.addType + " cena prema zadatim podacima";
      this.meadianListing = 'Medijan ' + this.addType + ' cena prema zadatim podacima';
    }
  }
}
