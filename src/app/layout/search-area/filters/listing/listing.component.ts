import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/store/services/data.service';
import { Store, select } from '@ngrx/store';
import * as UserActions from '../../../../store/actions/data-actions';
import * as fromStore from '../../../../store/reducers';

import html2canvas from 'html2canvas';
import { MapService } from 'src/app/store/services/map.service';
import { GraphService } from 'src/app/store/services/graph.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit, OnDestroy {
  @ViewChild('list', { static: true }) list: ElementRef;

  @Input('number') set setNumber(data) {
    if (data != null) {
      if (this.type == 'number-of-found-list') {
        this.count = data;
        this.typeOfListing = 'Broj oglašenih nekretnina';
        this.typeOfListingS = 'Ukupan broj pronadjenih oglasa'
        this.screenShotChart();
      }
    }
  }
  @Input() type: any;

  @Input('data') set setData(done) {
    if (done != null) {
      this.checkComponent(done, this.addType);
    }
  }

  typeOfListing: string;
  typeOfListingS: string;

  count: number;
  polygonActive: boolean;

  addType = '';
  constructor(private data: DataService,
    public graph: GraphService,
    private map: MapService,
    private store: Store<fromStore.AppState>) {
    this.map.polygonStatus$.subscribe(
      (res) => {
        if (res) {
          this.setNames(this.addType, res)
        }
      }
    )
    this.graph.chosedAddOrigin$
      .subscribe(
        (res) => {
          this.addType = res;
          this.setNames(res)
        }
      )
  }

  ngOnInit() {
    this.setNames(this.addType);
  }

  setNames(origin, status?) {
    if (this.type == 'number-of-found-list') {
      if (status) {
        this.typeOfListing = 'Broj oglašenih nekretnina u izabranom poligonu';
      } else {
        this.typeOfListing = 'Broj oglašenih nekretnina';
        this.typeOfListingS = 'Ukupan broj pronadjenih oglasa'
      }
    }

  }


  checkComponent(addsData: Array<any>, origin?) {
    if (this.type == 'number-of-found-list') {
      this.count = addsData.length;
      if (addsData.length > 0) {
        this.typeOfListing = 'Broj oglašenih nekretnina prema zadatim podacima';
        this.typeOfListingS = 'Ukupan broj pronadjenih oglasa'
      }
      else {
        this.typeOfListing = 'Broj oglašenih nekretnina';
        this.typeOfListingS = 'Ukupan broj pronadjenih oglasa'
      }
      this.screenShotChart();
    } else if (this.type == 'average-price-list') {
      this.count = this.data.pricePerGivenReq(this.type, addsData)
      this.checkCurrentFilter(this.addType, this.type)
      this.screenShotChart();

    } else if (this.type == 'median-price-list') {
      this.count = this.data.pricePerGivenReq(this.type, addsData)
      this.checkCurrentFilter(this.addType, this.type)
      this.screenShotChart();
    }
    if (this.type == 'average-price-list' && origin.length > 0) {
      this.checkCurrentFilter(this.addType, this.type)
    } else if (this.type == 'median-price-list' && origin.length > 0) {
      this.checkCurrentFilter(this.addType, this.type)
    }
  }

  screenShotChart(): any {
    const canvas = <HTMLCanvasElement>document.getElementById('listing');
    // html2canvas(this.list.nativeElement).then(canvas => {
    //   canvas.src = canvas.toDataURL();
    //   const parsed = canvas.src
    //   const graph = {
    //     origin: this.type,
    //     graph: parsed,
    //     desc: this.typeOfListingS
    //   };
    //   this.store.dispatch(UserActions.CheckScreenShot({ payload: graph }))
    // });
  }

  ngOnDestroy() {
    // this.map.polygonStatus$.unsubscribe()
  }

  checkCurrentFilter(origin, division) {
    if (division == 'average-price-list') {
      if (origin == 'rent') {
        this.typeOfListing = 'Prosečna cena iznajmljivanja po m2'
        this.typeOfListingS = 'Prosečna cena pronadjenih oglasa'
      } else {
        this.typeOfListing = 'Prosečna cena prodaje po m2'
        this.typeOfListingS = 'Prosečna cena pronadjenih oglasa'
      }
    } else {
      if (origin == 'rent') {
        this.typeOfListing = 'Prosečna median cena iznajmljivanja po m2'
        this.typeOfListingS = 'Prosečna median cena pronadjenih oglasa'
      } else {
        this.typeOfListing = 'Prosečna median cena prodaje po m2'
        this.typeOfListingS = 'Prosečna median cena pronadjenih oglasa'
      }
    }
    
  }
}
