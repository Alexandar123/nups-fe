import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Store, select } from '@ngrx/store';

import * as UserActions from '../../store/actions/data-actions';
import * as fromStore from '../../store/reducers';
import { Subject, ReplaySubject, BehaviorSubject } from 'rxjs';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { MoreInfoComponent } from './more-info/more-info.component';
import { DataService } from 'src/app/store/services/data.service';
import * as jwt_decode from "jwt-decode";
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalComponent } from 'src/app/confirm-modal/confirm-modal.component';
import { LocationModalComponent } from 'src/app/layout/search-area/filters/location-modal/location-modal.component';
import { TableService } from 'src/app/store/services/table.service';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  currentUser$: Subject<any> = new BehaviorSubject(2);
  coins$: Subject<number> = new BehaviorSubject(2);
  screenshots = [];
  activeFilter;
  animal: string;
  name: string;
  authenticated = false;
  public superUser: boolean;
  private coins: number;
  currentUser: any;
  constructor(public auth: AuthService,
    public store: Store<fromStore.AppState>,
    public dialog: MatDialog,
    private table: TableService,
    private dataService: DataService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getUser()
    this.auth.isAuthenticated$
      .subscribe(
        (res) => {
          this.authenticated = res
        }
      )

    this.store.select(fromStore.getCoinsData)
      .subscribe(
        (res) => {
          this.coins$.next(res)
          this.coins = res;
        }
      )

    this.store.select(fromStore.GetActiveFilter)
      .subscribe(
        (res) => {
          if (res != null) {
            this.activeFilter = res;
          }
        }
      )

    this.store.select(fromStore.GetScreenshost)
      .subscribe(
        (res) => {
          this.screenshots = res;
        }
      )

    this.store.select(fromStore.getUserData)
      .subscribe(
        (res) => {
          if (res != null) {
            this.currentUser = res;
          }
        }
      )
  }

  getUser() {
    let token = localStorage.getItem('token');

    if (token != undefined && token.length > 0) {
      let decoded = jwt_decode(token);
      let role = decoded['https://geoapp.nedovicm.com/user_authorization'][0]
      if (role == 'admin') {
        this.superUser = true;
      } else {
        this.superUser = false;
        this.openInfoDialog();
      }
    } else {
      this.openInfoDialog();
    }
  }

  openInfoDialog(origin?) {
    let org = origin;
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '250px',
      data: { name: 'dialog', origin: 'no' }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FilterModalComponent, {
      width: '250px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.store.dispatch(UserActions.GetAddsByKeyword({ payload: { city: 'Beograd', key: result } }))
      }
    });
  }

  showMoreUserInfo() {
    const dialogRef = this.dialog.open(MoreInfoComponent, {
      width: '250px',
    });
  }

  captureReport(event) {
    if (this.coins > 0) {
      let grap = '';
      for (let i = 0; i < this.screenshots.length; i++) {
        let current = ''
        current = '<h4>' + this.screenshots[i].desc + '</h4><br> <img src=' + this.screenshots[i].graph + '>';
        grap = grap.concat(current)
      }
      let report = `<h2>Izvestaj</h2><br>Iz izvrsene analize oglasenih cena za ` + this.activeFilter.typeOfProperty + ` na
lokacijama koje su obuhvacene i prikazane na mapi, u periodu od ` + this.activeFilter.date_from + ` do ` + this.activeFilter.date_to + `, moze se konstatovati da:
Predmetna lokacija postize cene stanova koje su vece/manje/uravnotezene nego druge lokacije u slektovanom
podrucju <br>
Povrsina stanova ima znacajan uticaj na oglasenu cenu, tako da stanovi povrsine ispod 30 m2 imaju median jedinicnu
cenu od `+ this.dataService.medianPriceSingle(30, '<') + ` eur/m2 dok stanovi vece povrisne tj. preko 80m2 dostizu median oglasenu cenu od ` + this.dataService.medianPriceSingle(80, '>') + `. Stanovi
povrsine od 45m2 do 65m2 dostizu median cenu od ` + this.dataService.medianPrieceMulti(45, 65) + ` eur/m2 dok stanovi povrsine 55m2 dostizu oglasenu median
cenu od ` + this.dataService.medianPriceSingle(55, '=') + ` eur/m2.
`
      let text = `<div>` + grap + `</div>`
      report = report.concat(text)
      let parser = new DOMParser();
      let parsedHtml = parser.parseFromString(report, 'text/html');
      var html = parsedHtml.body.outerHTML;
      var url = 'data:application/vnd.ms-word,' + escape(html);
      event._elementRef.nativeElement.setAttribute("href", url);
      event._elementRef.nativeElement.setAttribute("download", "export.doc");
      this.store.dispatch(UserActions.CoinSpent())
    } else {
      this.toastr.error('Notify the admin for more info', 'You dont have any coins left');
    }
  }
  openInfo(event) {
    const dialogRef = this.dialog.open(LocationModalComponent, {
      width: '450px',
      data: {origin: 'report'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result == 'report') {
          this.captureReport(event)
        }
        if (result == 'active') {
          this.table.exportData(event)
        }
      }
    });
  }
}
