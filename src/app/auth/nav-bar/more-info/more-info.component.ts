import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../auth.service';
import { Store, select } from '@ngrx/store';
import * as UserActions from '../../../store/actions/data-actions';
import * as fromStore from '../../../store/reducers';


@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.scss']
})
export class MoreInfoComponent implements OnInit {
  currentUser;
  constructor(
    public dialogRef: MatDialogRef<MoreInfoComponent>,
    public store: Store<fromStore.AppState>,
    auth: AuthService) { }

  ngOnInit() {
    this.store.select(fromStore.getUserData)
    .subscribe(
      (res) => {
        if (res != null) {
          this.currentUser = res;
        }
      }
    )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
