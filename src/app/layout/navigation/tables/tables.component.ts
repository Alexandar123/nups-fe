import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MainService } from 'src/app/store/services/main.service';
import { DataService } from 'src/app/store/services/data.service';
import { MatDialog } from '@angular/material';
import { LocationModalComponent } from '../../search-area/filters/location-modal/location-modal.component';
import { GraphService } from 'src/app/store/services/graph.service';
@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  constructor(public main: MainService,
    public graph: GraphService,
    public dom: ElementRef,
    public dialog: MatDialog,
    public data: DataService) { }

  listingBreakpoint;
  searchBreakpoint;
  mapBreakpoint;
  graphBreakpoint;
  ngOnInit() {
    if (window.innerWidth <= 400) {

    } else {
      this.listingBreakpoint = 3;
      this.searchBreakpoint = 9;
      this.mapBreakpoint = 9;
      this.graphBreakpoint = 6;
    }
    this.data.checkRoute()
  }

  openInfo() {
    const dialogRef = this.dialog.open(LocationModalComponent, {
      width: '450px',
      data: {origin: 'tables'}
    });
  }
}
