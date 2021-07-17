import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MainService } from 'src/app/store/services/main.service';
import { DataService } from 'src/app/store/services/data.service';
import { GraphService } from 'src/app/store/services/graph.service';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent implements OnInit {

  constructor(public main: MainService,
            public graph: GraphService,
            public data: DataService,
            public dom: ElementRef) {
            }
  
  listingBreakpoint;
  searchBreakpoint;
  mapBreakpoint;
  graphBreakpoint;
  tooltip: 'sss'
  // @ViewChild('ch', { read: ElementRef, static: false })
  // public dom: ElementRef;
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

}
