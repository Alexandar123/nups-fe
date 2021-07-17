import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UserActions from '../../../../store/actions/data-actions';
import * as fromStore from '../../../../store/reducers/index';
import { ApiService } from 'src/app/store/services/api.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/store/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { GraphService } from 'src/app/store/services/graph.service';
const provider = new OpenStreetMapProvider();

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  @Input() name: any;
  @Input('data') set setData(done) {

  }
  towns$: Subject<any> = new BehaviorSubject<any>(null);
  selectedTown: any;
  tempAdds = [];
  selectedRentSell = '';
  selectedPropType = 'apartment';
  town = 'Beograd';
  street = '';
  minSqare = 0;
  maxSqare = 0;
  areaRadius = 0;
  authenticated: boolean;
  fromDate = '';
  toDate = '';
  lastFilter: any;
  coins: number;
  state = 'Srbija';
  inProgress$: Subject<boolean> = new BehaviorSubject<boolean>(null);

  addType: string;
  constructor(private store: Store<fromStore.AppState>,
    private graph: GraphService,
    private api: ApiService,
    private auth: AuthService,
    private data: DataService,
    private toastr: ToastrService) {
    this.auth.isAuthenticated$
      .subscribe(
        (res) => {
          this.authenticated = res
        }
      )
  }

  ngOnInit() {
    this.store.select(fromStore.getCoinsData)
      .subscribe(
        (res) => {
          this.coins = res;
        }
      )
  }

  setAddType() {
    this.graph.chosedAddOrigin$.next(this.selectedRentSell)
  }


  setLocation() {
    let a = this.checkValidity();

    if (true) {
      if (a.length > 0) {
        this.toastr.info('You need to fill the ' + a + ' filed', '');
      } else {
        provider.search({ query: this.town }).then(
          (res) => {
            this.store.dispatch(UserActions.SetTownLocation({ payload: res[0] }))
          }
        )
        this.inProgress$.next(true);
        this.store.dispatch(UserActions.SetLoadingSpinner({ payload: true }))
        this.graph.chosenAddType$.next(this.selectedPropType);
        this.setAddType()
        let filter = {
          address: this.town,
          typeOfProperty: this.selectedPropType.toUpperCase(),
          typeOfAd: this.selectedRentSell.toUpperCase(),
          minSqare: this.minSqare,
          maxSquare: this.maxSqare,
          date_from: this.fromDate,
          date_to: this.toDate,
          city: this.town,
          state: this.state,
          street: this.street
        }
        this.graph.getMeadianByPros(filter)
        if (this.maxSqare == 0) {
          this.store.dispatch(UserActions.SetFilter({ payload: filter }))
          this.api.mainFilter(filter)
            .subscribe(
              (res) => {
                this.inProgress$.next(false);
                this.store.dispatch(UserActions.SetLoadingSpinner({ payload: false }))
                this.store.dispatch(UserActions.SetTempAdds({ payload: res }))
                this.checkChanges(filter, res.length);
                this.lastFilter = filter;
              }
            )
        } else {
          this.store.dispatch(UserActions.SetFilter({ payload: filter }))
          this.api.mainFilterAreas(filter)
            .subscribe(
              (res) => {
                this.inProgress$.next(false);
                this.store.dispatch(UserActions.SetLoadingSpinner({ payload: false }))
                this.store.dispatch(UserActions.SetTempAdds({ payload: res }))
                this.checkChanges(filter, res.length);
                this.lastFilter = filter;
              }
            )
        }
        this.data.newSearch$.next(true)
      }
    } else {
      this.toastr.error('Notify the admin for more info', 'You dont have any coins left');
    }


  }

  checkChanges(filter, adds) {
    let change = false;
    if (this.lastFilter != undefined) {
      if (this.lastFilter.typeOfProperty.toLowerCase() != filter.typeOfProperty.toLowerCase()) {
        change = true;
      } else if (this.lastFilter.state != filter.state) {
        change = true;
      } else if (this.lastFilter.typeOfAd != filter.typeOfAd) {
        change = true;
      } else if (this.lastFilter.date_from != filter.date_from) {
        change = true
      } else if (this.lastFilter.date_to != filter.date_to) {
        change = true;
      } else if (this.lastFilter.street.toLowerCase() != filter.street.toLowerCase()) {
        change = true;
      }
    } else if (adds > 0) {
      this.store.dispatch(UserActions.CoinSpent())
      return;
    }
    if (change == true && adds > 0) {
      this.store.dispatch(UserActions.CoinSpent())
    }
  }
  checkValidity(): string {
    let fields = ''
    let valid = false;
    if (this.state.length > 0) {
      valid = true;
    } else {
      fields = 'state';
      valid = false;
      return fields;
    }
    if (this.town.length > 0) {
      valid = true;
    } else {
      fields = 'town';
      valid = false;
      return fields;
    }
    if (this.selectedRentSell != null) {
      valid = true
    } else {
      fields = 'Type of add';
      valid = false;
      return fields;
    }
    if (this.selectedPropType != null) {
      valid = true
    } else {
      fields = 'Type of property';
      valid = false;
      return fields;
    }
    if (this.fromDate.length > 0) {
      valid = true;
    } else {
      fields = 'From date';
      valid = false;
      return fields;
    }
    if (this.toDate.length > 0) {
      valid = true;
    } else {
      fields = 'To date';
      valid = false;
      return fields;
    }
    return fields;
  }

  checkIfEmpty(val: any, origin: string) {
    if (val == null) {
      if (origin == 'max') {
        this.maxSqare = 0;
      } else {
        this.minSqare = 0;
      }
    }
  }

  dateChange(event, from) {
    let month = event.value.getUTCMonth() + 1;
    month = this.minTwoDigits(month)
    let day = event.value.getUTCDate();
    day = this.minTwoDigits(day)

    let year = event.value.getUTCFullYear();
    let newdate = year + '-' + month + '-' + day;
    if (from === 'start') {
      this.fromDate = newdate;
    } else {
      this.toDate = newdate;
    }
  }

  minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
  }

  removeLocation(form) {
    form.reset()
    this.state = 'Srbija';
    this.selectedTown = null;
    this.town = '';
    this.street = '';
    this.minSqare = 0;
    this.maxSqare = 0;
    this.areaRadius = 0;
    this.fromDate = '';
    this.toDate = '';
    this.selectedRentSell = null;
    this.selectedPropType = null;
    this.store.dispatch(UserActions.SetLoadingSpinner({ payload: false }))
    this.store.dispatch(UserActions.GetCitiesFromCountry())
    this.store.dispatch(UserActions.SetLocationResponse({ payload: [] }))
  }



}
