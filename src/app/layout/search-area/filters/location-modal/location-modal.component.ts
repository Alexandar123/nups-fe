import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
  origin: string;
  name: string;
}

@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss']
})
export class LocationModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LocationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  type: any;
  ngOnInit() {
  }


  setType(event) {
    this.type = event;
    this.dialogRef.close(this.type);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
