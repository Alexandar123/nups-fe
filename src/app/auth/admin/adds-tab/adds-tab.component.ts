import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, Sort, MatSort } from '@angular/material';
import { DataService } from 'src/app/store/services/data.service';
import { TableService } from 'src/app/store/services/table.service';
import { ApiService } from 'src/app/store/services/api.service';
import { AdminModalComponent } from '../admin-modal/admin-modal.component';
import * as UserActions from '../../../store/actions/data-actions';
import * as fromStore from '../../../store/reducers/index';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-adds-tab',
  templateUrl: './adds-tab.component.html',
  styleUrls: ['./adds-tab.component.scss']
})

export class AddsTabComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'url', 'price', 'price_per', 'area', 'dateAdded', 'type_of_prop', 'type_of_add', 'addActive'];
  dataSource = new MatTableDataSource([]);
  dataSet: boolean;
  start: any;
  end: any;
  sortedData

  numberOfElements: number;
  page = 1;
  lastSort: Sort;

  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(public data: DataService,
    public store: Store<fromStore.AppState>,
    public table: TableService,
    private api: ApiService,
    public dialog: MatDialog) {

  }

  ngOnInit() {
    this.data.adminAdds$
      .subscribe(
        (res) => {
          this.dataSource.data = res;
          this.sortedData = res;
          this.numberOfElements = res;
          this.store.dispatch(UserActions.SetLoadingSpinner({ payload: false }))
          if (this.lastSort != undefined) {
            this.sortData(this.lastSort);
          } else {
            this.sortData(this.sort);
          }
        }
      )
    this.sort.start = 'desc';
  }

  searchAdds() {
    if (this.start.length > 0 && this.end.length > 0) {
      this.store.dispatch(UserActions.SetLoadingSpinner({ payload: true }))
      this.data.getAdminAdds(this.start, this.end, 0);
    }
  }

  dateChange(event, from) {

    let month = JSON.stringify(event.value.getUTCMonth() + 1);
    let day = JSON.stringify(event.value.getUTCDate())
    let year = JSON.stringify(event.value.getUTCFullYear());
    if (month.length == 1) {
      month = '0' + month
    }
    if (day.length == 1) {
      day = '0' + day
    }
    let newdate = year + '-' + month + '-' + day;
    if (from === 'start') {
      this.start = newdate;
    } else {
      this.end = newdate;
    }
  }

  openDialog(origin, data?) {
    let org = origin;
    const dialogRef = this.dialog.open(AdminModalComponent, {
      width: '350px',
      data: { name: 'admin', origin: origin, data: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'ok') {
        this.api.deleteBadAdds()
          .subscribe((res) => {
            if (origin == 'adds') {
              this.searchAdds();
            }
          })
      }
    });
  }

  pageChanged(event) {
    if (this.start.length > 0 && this.end.length > 0) {
      this.data.getAdminAdds(this.start, this.end, event.page);
      this.store.dispatch(UserActions.SetLoadingSpinner({ payload: true }))
    }
  }
  openAdd(link, event) {
    event.preventDefault()
    window.open(link)
  }

  ngOnDestroy() {
    // this.data.adminAdds$.unsubscribe();
  }

  editAdd(add) {
    this.openDialog('editAdd', add)
  }

  sortData(sort: Sort) {
    this.lastSort = sort;
    const data = this.dataSource.data.slice();
    if (sort.direction === '' || (sort.active != undefined && !sort.active)) {
      this.sortedData = data;
      return;
    } else {
      this.sortedData = []
    }
    
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'price_per': return this.compare(a.pricePerMeter, b.pricePerMeter, isAsc);
        case 'price': return this.compare(a.price, b.price, isAsc);
        case 'area': return this.compare(a.areas, b.areas, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
