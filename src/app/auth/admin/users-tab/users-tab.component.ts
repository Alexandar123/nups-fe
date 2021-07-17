import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ApiService } from 'src/app/store/services/api.service';
import { Subject, ReplaySubject } from 'rxjs';
import { AdminModalComponent } from '../admin-modal/admin-modal.component';
import { ExportService } from 'src/app/store/services/export.service';
import { DataService } from 'src/app/store/services/data.service';
@Component({
  selector: 'app-users-tab',
  templateUrl: './users-tab.component.html',
  styleUrls: ['./users-tab.component.scss']
})
export class UsersTabComponent implements OnInit {
  currentUser$: Subject<any> = new ReplaySubject<any>(null);
  activeUser: any;
  constructor(private api: ApiService,
    public data: DataService,
    public dialog: MatDialog,
    private exp: ExportService
  ) { }
  displayedColumns: string[] = ['id', 'name', 'email', 'lastname', 'city', 'country', 'mobile', 'points', 'points expiration'];
  dataSource = new MatTableDataSource([]);
  ngOnInit() {
    this.dataSource.data = [];
    this.getUsers()
  }

  getUsers() {
    this.api.getAllUsers()
      .subscribe(
        (res) => {
          this.dataSource.data = res;
          if (res.length > 0) {
            for (let i = 0; i < this.dataSource.data.length; i++) {
              this.dataSource.data[i].date_of_creating_account = this.dateChange(this.dataSource.data[i].date_of_creating_account)
              this.dataSource.data[i].coins_expiration = this.dateChange(this.dataSource.data[i].coins_expiration)
            }
          }
        }
      )

  }
  setActiveUser(id) {
    this.currentUser$.next(this.data.deepCopy(id))
    this.activeUser = this.data.deepCopy(id);
  }

  openDialog(origin?) {
    let org = origin;
    const dialogRef = this.dialog.open(AdminModalComponent, {
      width: '250px',
      data: { name: 'admin', origin: 'users'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.api.increaseUserPoints({ id: this.activeUser.id, points: result })
          .subscribe(
            (res) => {
              this.getUsers()
            }
          )
      }
    });
  }


  dateChange(event) {
    var date = new Date(event);

    let month = JSON.stringify(date.getUTCMonth() + 1);
    let day = JSON.stringify(date.getUTCDate())
    let year = JSON.stringify(date.getUTCFullYear());
    if (month.length == 1) {
      month = '0' + month
    }
    if (day.length == 1) {
      day = '0' + day
    }
    let newdate = year + '-' + month + '-' + day;
    return newdate;
  }
  exportUsers() {
    this.exp.exportExcel(this.dataSource.data, 'users');
  }

  deleteUser(userId, authId) {
    this.api.deleteUser(userId)
      .subscribe(
        (res) => {
          this.getUsers()
          this.deleteUserAuth(authId);
        }
      )

  }

  deleteUserAuth(id) {
    this.api.deleteUserAuth(id)
      .subscribe(
        (res) => {
        }
      )
  }

  updateActive(id) {
    this.activeUser.date_of_creating_account = this.dateChange(this.activeUser.date_of_creating_account);
    this.activeUser.coins_expiration = this.dateChange(this.activeUser.coins_expiration)
    this.api.updateUser(id, this.activeUser)
      .subscribe(
        (res) => {
          this.getUsers()
        }
      )
  }
}
