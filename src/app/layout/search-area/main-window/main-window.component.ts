import { Component, OnInit, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';

import * as UserActions from '../../../store/actions/data-actions';
import * as fromStore from '../../../store/reducers';
import { ApiService } from 'src/app/store/services/api.service';
import { MatDialog } from '@angular/material';
import { MainService } from 'src/app/store/services/main.service';
import { DataService } from 'src/app/store/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  type?: any;
}

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class MainWindowComponent implements OnInit, AfterViewInit {
  @ViewChild('mainTab', { read: ElementRef, static: false })
  public mainTab: ElementRef;
  @ViewChild('graphsTab', { read: ElementRef, static: false })
  public graphsTab: ElementRef;
  @ViewChild('tablesTab', { read: ElementRef, static: false })
  public tablesTab: ElementRef;
  tempAdds = [];
  screenshots = [];
  activeFilter;
  allAdsCount: number;



  tiles: Tile[] = [
    { text: 'Listing-all', cols: 4, rows: 3, color: '#ffffff', type: 'Listing' },
    { text: 'Location', cols: 3, rows: 3, color: '#ffffff', type: 'Location' },
    { text: 'Price', cols: 3, rows: 3, color: '#ffffff', type: 'Price' },
    { text: 'Area', cols: 2, rows: 3, color: '#ffffff', type: 'Area' },
    { text: 'Pie-type', cols: 3, rows: 3, color: '#ffffff', type: 'Pie' },
    { text: 'Pie-rent-sale', cols: 3, rows: 3, color: '#ffffff', type: 'Pie' },
    { text: 'Map', cols: 6, rows: 3, color: '#ffffff', type: 'Map' },
    { text: 'Listing-median-price', cols: 3, rows: 2, color: '#ffffff', type: 'Listing' },
    { text: 'Listing-median-price-avg', cols: 3, rows: 2, color: '#ffffff', type: 'Listing' },
    { text: 'Listing-median-price-per-m2', cols: 3, rows: 2, color: '#ffffff', type: 'Listing' },
    { text: 'Listing-median-rent', cols: 3, rows: 2, color: '#ffffff', type: 'Listing' },
    { text: 'Graph-price-pre-m2-rent', cols: 6, rows: 3, color: '#ffffff', type: 'Graph' },
    { text: 'Graph-price-pre-m2-rent', cols: 6, rows: 3, color: '#ffffff', type: 'Graph' },
    { text: 'Table-rent', cols: 6, rows: 3, color: '#ffffff', type: 'Table' },
    { text: 'Table-sell', cols: 6, rows: 3, color: '#ffffff', type: 'Table' },
    { text: 'Bar-year-built', cols: 6, rows: 3, color: '#ffffff', type: 'Bar' },
    { text: 'Bar-rooms', cols: 6, rows: 3, color: '#ffffff', type: 'Bar' },
    { text: 'Pie-agency-private', cols: 3, rows: 3, color: '#ffffff', type: 'Pie' }

  ];

  listingBreakpoint;
  searchBreakpoint;
  mapBreakpoint;
  graphBreakpoint;

  //
  navbarVisibilty: boolean;
  mobileDisplayed: boolean;

  activeTab = 'main'
  constructor(private main: MainService,
    public auth: AuthService,
    private store: Store<fromStore.AppState>,
    public dialog: MatDialog,
    public render: Renderer2,
    private cdRef: ChangeDetectorRef) {
    this.main.addsData$.subscribe((res) => {
      if (res.length > 0) {
        this.cdRef.detectChanges()
      }
    })
  }

  ngOnInit() {
    this.navbarVisibilty = false;
    this.windowAdapt()
  }
  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
  onResize(event) {
    if (window.innerWidth <= 400) {
      this.listingBreakpoint = 6;
      this.searchBreakpoint = 12;
      this.mapBreakpoint = 12;
      this.graphBreakpoint = 12;
    }
  }

  removeFilter(data) {
    this.store.dispatch(UserActions.CheckFilter({ payload: data }))
  }

  increseSize(template, direction: string) {
    if (direction == 'right') {
      template._colspan++;
    } else {
      template._rowspan++;
    }
  }

  checkChart(graph, element) {
    let a = graph.allCharts[0];
    a.options.maintainAspectRatio = false;
    setTimeout(() => {
      element._element.nativeElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }, 400)
  }

  windowAdapt() {
    if (window.innerWidth <= 900) {
      this.mobileDisplayed = false;
      // this.navbarVisibilty = false;
    } else {
      this.mobileDisplayed = true;
      // this.navbarVisibilty = true;
    }
  }

  showMenu(dom) {
    if (!this.navbarVisibilty) {
      this.navbarVisibilty = true;
      this.mobileDisplayed = true;
      this.render.removeClass(dom, 'navigation-hide');
      this.render.addClass(dom, 'navigation-show');
    } else {
      this.mobileDisplayed = false;
      this.navbarVisibilty = false;
      this.render.removeClass(dom, 'navigation-show');
      this.render.addClass(dom, 'navigation-hide');
    }
  }


  calcHeight(main, graphs, tables) {
    if (main && graphs && tables) {
      let mainHeight = main.dom.nativeElement.firstChild.clientHeight;
      let graphsHeight = graphs.dom.nativeElement.firstChild.clientHeight;
      let tablesHeight = tables.dom.nativeElement.firstChild.clientHeight;
      return mainHeight + graphsHeight + tablesHeight;
    } else {
      return 0;
    }
  }

  showHideElements(dom, active) {
    this.activeTab = active;
    this.mobileDisplayed = false;
    this.navbarVisibilty = false;
    this.render.removeClass(dom, 'navigation-show');
    this.render.addClass(dom, 'navigation-hide');
    if (active == 'main') {
      this.render.removeClass(this.mainTab.nativeElement, 'hidden');
      this.render.removeClass(this.graphsTab.nativeElement, 'hidden');
      this.render.removeClass(this.tablesTab.nativeElement, 'hidden');
      this.render.addClass(this.mainTab.nativeElement, 'visible');
      this.render.addClass(this.graphsTab.nativeElement, 'visible');
      this.render.addClass(this.tablesTab.nativeElement, 'visible');
    }
    if (active == 'graphs') {
      this.render.removeClass(this.mainTab.nativeElement, 'visible');
      this.render.removeClass(this.graphsTab.nativeElement, 'hidden');
      this.render.removeClass(this.tablesTab.nativeElement, 'visible');
      this.render.addClass(this.mainTab.nativeElement, 'hidden');
      this.render.addClass(this.graphsTab.nativeElement, 'visible');
      this.render.addClass(this.tablesTab.nativeElement, 'hidden');
    }
    if (active == 'tables') {
      this.render.removeClass(this.mainTab.nativeElement, 'visible');
      this.render.removeClass(this.graphsTab.nativeElement, 'visible');
      this.render.removeClass(this.tablesTab.nativeElement, 'hidden');
      this.render.addClass(this.mainTab.nativeElement, 'hidden');
      this.render.addClass(this.graphsTab.nativeElement, 'hidden');
      this.render.addClass(this.tablesTab.nativeElement, 'visible');
    }
  }
}


