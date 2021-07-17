import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/store/services/data.service';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExportService } from 'src/app/store/services/export.service';
// import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { Store, select } from '@ngrx/store';
import * as UserActions from '../../../../store/actions/data-actions';
import * as fromStore from '../../../../store/reducers';
import { TableService } from 'src/app/store/services/table.service';
import { ApiService } from 'src/app/store/services/api.service';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() name: any;

  activeAdds = [];
  @Input() set number(data) {
    if (data != null && this.activeAdds.length == 0) {
      // this.setData(this.data.rentSale(this.name))
      this.activeAdds = []
    }
  }
  @Input('data') set setAdds(done) {
    if (done != null && this.activeAdds.length == 0) {
      // this.setData(this.data.rentSale(this.name, done))
      let ids = this.tableService.getTableData(done)
      this.api.getTableData(ids)
        .subscribe((res) => {
          this.setData(res)
        })
    }
  }
  displayedColumns: string[] = ['id', 'active', 'url', 'price', 'price-per', 'area', 'dateAdded', 'addActive'];
  dataSource = new MatTableDataSource([]);
  dataSet: boolean;
  isChecked: boolean;
  typeOf: string;
  disableCheckbox = false;
  addsData: Array<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private tableService: TableService,
    private store: Store<fromStore.AppState>,
    private data: DataService,
    public dialog: MatDialog,
    public api: ApiService,
    public exp: ExportService) { 
      this.data.newSearch$.subscribe(
        (res) => {
          if (this.activeAdds.length > 0 && res == true) {
            this.unchechCheckboxes();
          }
        }
      )
    }
  ngOnInit() {
  }

  setData(res) {
    this.dataSet = true;
    // this.typeOf = res;
    this.dataSource.data = res;
  }


  openAdd(link, event) {
    event.preventDefault()
    window.open(link)
  }

  checkValue() {
    if (this.activeAdds.length > 0) {
      this.store.dispatch(UserActions.SetAddsData({ payload: this.data.deepCopy(this.activeAdds) }))
      this.store.dispatch(UserActions.SetActiveAdds({ payload: this.data.deepCopy(this.activeAdds) }))
    } else {
      this.store.dispatch(UserActions.SetAddsData({ payload: this.dataSource.data }))
      this.store.dispatch(UserActions.SetActiveAdds({ payload: [] }))
    }
  }
  checkCheckbox(element, dom) {
    let index;
    for (let i = 0; i < this.activeAdds.length; i++) {
      if (element.id_ad == this.activeAdds[i].id_ad) {
        index = i;
      }
    }
    if (index == undefined) {
      this.activeAdds.push(element)
    } else {
      this.activeAdds.splice(index, 1)
      dom.checked = false;
      this.disableCheckbox = false;
    }
    if (this.activeAdds.length >= 5) {
      this.disableCheckbox = true;
      alert('You can only select 5 adds')
      // this.openDialog();
    } else {
      this.disableCheckbox = false;
    }
    if (this.activeAdds.length == 0) {
      this.store.dispatch(UserActions.ResetData())
      this.store.dispatch(UserActions.SetActiveAdds({ payload: [] }))
    }
  }

  checkDisabled(add, dom) {
    if (dom.disabled) {
      this.checkCheckbox(add, dom)
    }
  }

  unchechCheckboxes() {
    let len = this.activeAdds.length;
    for (let i = 0; i < len; i++) {
      let input = document.getElementById('selected-'+ this.activeAdds[i].id_ad) as HTMLInputElement;
      input.checked = false;
    }
    this.activeAdds = [];
    this.store.dispatch(UserActions.ResetData())
  }

  applyFilter() {
    if (this.activeAdds.length > 0) {
      this.data.tableFilter(this.activeAdds)
      this.activeAdds = [];
    } else {
      this.data.resetTableFilters();
    }
  }

  exportData(event) {
    let htmlData = '';
    if (this.activeAdds.length == 1) {
      htmlData = this.singleRow();
    } else if (this.activeAdds.length == 2) {
      htmlData = this.doubleRow();
    } else if (this.activeAdds.length == 3) {
      htmlData = this.threeRows();
    } else if (this.activeAdds.length == 4) {
      htmlData = this.fourRows();
    } else {
      htmlData = this.multipleRows();
    }
    let parser = new DOMParser();
    let parsedHtml = parser.parseFromString(htmlData, 'text/html');
    var html = parsedHtml.body.outerHTML;
    var url = 'data:application/vnd.ms-word,' + escape(html);
    event._elementRef.nativeElement.setAttribute("href", url);
    event._elementRef.nativeElement.setAttribute("download", "export.doc"); // Choose the file name
  }


  dateChange(event) {
    var date = new Date(event);

    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();
    let newdate = year + '-' + month + '-' + day;
    return newdate;
  }

  singleRow(): string {
    let a = `
    <table style="border-collapse: collapse" border="1">
    <tr>
      <th rowspan="2">Pozicija</th>
      <th colspan="1">Podaci o komparativima</th>
    </tr>
    <tr>
      <td>C1</td>
    </tr>
    <tr>
      <td>Adresa</td>
      <td>` + this.activeAdds[0].description + `</td>
    </tr>
    <tr>
      <td>Povrsina</td>
      <td>` + this.activeAdds[0].areas + `m2</td>
    </tr>
    <tr>
      <td>Oglasena cena</td>
      <td>` + this.activeAdds[0].price + ` Eur</td>
    </tr>
    <tr>
      <td>Datum ponude</td>
      <td>` + this.dateChange(this.activeAdds[0].ad_published) + `</td>
    </tr>
    <tr>
      <td>Korigovana cena</td>
      <td></td>
    </tr>
      <tr>
      <td>Jedinicna cena</td>
      <td></td>
    </tr>
  </table>`;
    return a;
  }

  doubleRow(): string {
    let a = `
    <table style="border-collapse: collapse" border="1">
    <tr>
      <th rowspan="2">Pozicija</th>
      <th colspan="2">Podaci o komparativima</th>
    </tr>
    <tr>
      <td>C1</td>
      <td>C2</td>
    </tr>
    <tr>
      <td>Adresa</td>
      <td>` + this.activeAdds[0].description + `</td>
      <td>` + this.activeAdds[1].description + `</td>
    </tr>
    <tr>
      <td>Povrsina</td>
      <td>` + this.activeAdds[0].areas + `m2</td>
      <td>` + this.activeAdds[1].areas + `m2</td>
    </tr>
    <tr>
      <td>Oglasena cena</td>
      <td>` + this.activeAdds[0].price + ` Eur</td>
      <td>` + this.activeAdds[1].price + ` Eur</td>
    </tr>
    <tr>
      <td>Datum ponude</td>
      <td>` + this.dateChange(this.activeAdds[0].ad_published) + `</td>
      <td>` + this.dateChange(this.activeAdds[1].ad_published) + `</td>
    </tr>
    <tr>
      <td>Korigovana cena</td>
      <td></td>
      <td></td>
    </tr>
      <tr>
      <td>Jedinicna cena</td>
      <td></td>
      <td></td>
    </tr>
  </table>`
    return a;
  }

  threeRows(): string {
    let a = `
    <table style="border-collapse: collapse" border="1">
    <tr>
      <th rowspan="2">Pozicija</th>
      <th colspan="3">Podaci o komparativima</th>
    </tr>
    <tr>
      <td>C1</td>
      <td>C2</td>
      <td>C3</td>
    </tr>
    <tr>
      <td>Adresa</td>
      <td>` + this.activeAdds[0].description + `</td>
      <td>` + this.activeAdds[1].description + `</td>
      <td>` + this.activeAdds[2].description + `</td>
    </tr>
    <tr>
      <td>Povrsina</td>
      <td>` + this.activeAdds[0].areas + `m2</td>
      <td>` + this.activeAdds[1].areas + `m2</td>
      <td>` + this.activeAdds[2].areas + `m2</td>
    </tr>
    <tr>
      <td>Oglasena cena</td>
      <td>` + this.activeAdds[0].price + ` Eur</td>
      <td>` + this.activeAdds[1].price + ` Eur</td>
      <td>` + this.activeAdds[2].price + ` Eur</td>
    </tr>
    <tr>
      <td>Datum ponude</td>
      <td>` + this.dateChange(this.activeAdds[0].ad_published) + `</td>
      <td>` + this.dateChange(this.activeAdds[1].ad_published) + `</td>
      <td>` + this.dateChange(this.activeAdds[2].ad_published) + `</td>
    </tr>
    <tr>
      <td>Korigovana cena</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
      <tr>
      <td>Jedinicna cena</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </table>`
    return a;
  }

  fourRows(): string {
    let a = `
    <table style="border-collapse: collapse" border="1">
    <tr>
      <th rowspan="2">Pozicija</th>
      <th colspan="4">Podaci o komparativima</th>
    </tr>
    <tr>
      <td>C1</td>
      <td>C2</td>
      <td>C3</td>
      <td>C4</td>
    </tr>
    <tr>
      <td>Adresa</td>
      <td>` + this.activeAdds[0].description + `</td>
      <td>` + this.activeAdds[1].description + `</td>
      <td>` + this.activeAdds[2].description + `</td>
      <td>` + this.activeAdds[3].description + `</td>

    </tr>
    <tr>
      <td>Povrsina</td>
      <td>` + this.activeAdds[0].areas + `m2</td>
      <td>` + this.activeAdds[1].areas + `m2</td>
      <td>` + this.activeAdds[2].areas + `m2</td>
      <td>` + this.activeAdds[3].areas + `m2</td>

    </tr>
    <tr>
      <td>Oglasena cena</td>
      <td>` + this.activeAdds[0].price + ` Eur</td>
      <td>` + this.activeAdds[1].price + ` Eur</td>
      <td>` + this.activeAdds[2].price + ` Eur</td>
      <td>` + this.activeAdds[3].price + ` Eur</td>

    </tr>
    <tr>
      <td>Datum ponude</td>
      <td>` + this.dateChange(this.activeAdds[0].ad_published) + `</td>
      <td>` + this.dateChange(this.activeAdds[1].ad_published) + `</td>
      <td>` + this.dateChange(this.activeAdds[2].ad_published) + `</td>
      <td>` + this.dateChange(this.activeAdds[3].ad_published) + `</td>

    </tr>
    <tr>
      <td>Korigovana cena</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
      <tr>
      <td>Jedinicna cena</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>

    </tr>
  </table>`
    return a;
  }

  multipleRows(): string {
    let a = `
    <table style="border-collapse: collapse" border="1">
    <tr>
      <th rowspan="2">Pozicija</th>
      <th colspan="5">Podaci o komparativima</th>
    </tr>
    <tr>
      <td>C1</td>
      <td>C2</td>
      <td>C3</td>
      <td>C4</td>
      <td>C5</td>
    </tr>
    <tr>
      <td>Adresa</td>
      <td>` + this.activeAdds[0].description + `</td>
      <td>` + this.activeAdds[1].description + `</td>
      <td>` + this.activeAdds[2].description + `</td>
      <td>` + this.activeAdds[3].description + `</td>
      <td>` + this.activeAdds[4].description + `</td>

    </tr>
    <tr>
      <td>Povrsina</td>
      <td>` + this.activeAdds[0].areas + `m2</td>
      <td>` + this.activeAdds[1].areas + `m2</td>
      <td>` + this.activeAdds[2].areas + `m2</td>
      <td>` + this.activeAdds[3].areas + `m2</td>
      <td>` + this.activeAdds[4].areas + `m2</td>

    </tr>
    <tr>
      <td>Oglasena cena</td>
      <td>` + this.activeAdds[0].price + ` Eur</td>
      <td>` + this.activeAdds[1].price + ` Eur</td>
      <td>` + this.activeAdds[2].price + ` Eur</td>
      <td>` + this.activeAdds[3].price + ` Eur</td>
      <td>` + this.activeAdds[4].price + ` Eur</td>

    </tr>
    <tr>
      <td>Datum ponude</td>
      <td>` + this.dateChange(this.activeAdds[0].ad_published) + `</td>
      <td>` + this.dateChange(this.activeAdds[1].ad_published) + `</td>
      <td>` + this.dateChange(this.activeAdds[2].ad_published) + `</td>
      <td>` + this.dateChange(this.activeAdds[3].ad_published) + `</td>
      <td>` + this.dateChange(this.activeAdds[4].ad_published) + `</td>

    </tr>
    <tr>
      <td>Korigovana cena</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
      <tr>
      <td>Jedinicna cena</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>

    </tr>
  </table>`
    return a;
  }


  exportAll() {
    let arr = [];
    arr = JSON.parse(JSON.stringify(this.dataSource.data));
    for (let i = 0; i < arr.length; i++) {
      delete arr[i].image1;
      delete arr[i].image2;
      delete arr[i].screenshot;
      delete arr[i].lat;
      delete arr[i].lon;
      delete arr[i].ad_removed;
      arr[i].date_of_inserting = this.dateChange(arr[i].date_of_inserting);
      arr[i].ad_published = this.dateChange(arr[i].ad_published);
    }
    this.exp.exportExcel(arr, 'download');
  }
}