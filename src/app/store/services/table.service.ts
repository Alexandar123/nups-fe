import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import * as UserActions from '../actions/data-actions';
import * as fromStore from '../reducers';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TableService {
activeAdds = [];
tableData: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private data: DataService,
              private store: Store<fromStore.AppState>) {
    this.store.select(fromStore.GetActiveAdds)
    .subscribe(
      (res) => {
        if (res != null && res.length > 0) {
          this.activeAdds = res;
        }
      }
    )
   }

  getTableData(adds) {
    let data = this.data.deepCopy(adds);
    let ids = [];
    const addsLen = data.length;
    if (addsLen > 100) {
      data.length = 100;
      for (let i = 0; i < data.length; i++) {
        ids.push(data[i].id_ad)
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        ids.push(data[i].id_ad)
      }
    }
    return ids;
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


  // exportAll() {
  //   let arr = [];
  //   arr = JSON.parse(JSON.stringify(this.dataSource.data));
  //   for (let i = 0; i < arr.length; i++) {
  //     delete arr[i].image1;
  //     delete arr[i].image2;
  //     delete arr[i].screenshot;
  //     delete arr[i].lat;
  //     delete arr[i].lon;
  //     delete arr[i].ad_removed;
  //     arr[i].date_of_inserting = this.dateChange(arr[i].date_of_inserting);
  //     arr[i].ad_published = this.dateChange(arr[i].ad_published);
  //   }
  //   this.exp.exportExcel(arr, 'download');
  // }
}
