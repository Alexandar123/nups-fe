import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
  origin: string;
  name: string;
}
@Component({
  selector: 'app-add-type-modal',
  templateUrl: './add-type-modal.component.html',
  styleUrls: ['./add-type-modal.component.scss']
})
export class AddTypeModalComponent implements OnInit {
  fromDate: string;
  toDate: string;
  
  constructor(
    public dialogRef: MatDialogRef<AddTypeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  type: any;
  ngOnInit() {
  }


  setType(event) {
    this.type = event;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  dateChange(event, from) {
    let month = event.value.getUTCMonth() + 1;
    let day = event.value.getUTCDate();
    let year = event.value.getUTCFullYear();
    let newdate = year + '-' + month + '-' + day;
    if (from === 'start') {
      this.fromDate = newdate;
    } else {
      this.toDate = newdate;
    }
  }

}
