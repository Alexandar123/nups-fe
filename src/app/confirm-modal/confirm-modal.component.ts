import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../auth/auth.service';
export interface DialogData {
  name: string;
}
@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  type: any;
  constructor(
    private auth: AuthService,
    public dialogRef: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {

  }

  setType(event) {
    this.type = event;
    if (event == false) {
      this.auth.logout()
    }
    this.onNoClick()
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
