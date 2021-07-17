import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/store/services/data.service';
export interface DialogData {
  origin: string;
  name: string;
  data: any;
}
@Component({
  selector: 'app-admin-modal',
  templateUrl: './admin-modal.component.html',
  styleUrls: ['./admin-modal.component.scss']
})
export class AdminModalComponent implements OnInit {

  activeStatus: string;
  
  constructor(public dataSrv: DataService,
    public dialogRef: MatDialogRef<AdminModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
      
    }
  type: any;
  ngOnInit() {
    this.setInputStatus(this.data.data.active, 'toString')
  }

  setInputStatus(addStatus: number, type: string) {
    if (type == 'toString') {
      if (addStatus === 1) {
        this.activeStatus = 'aktivan';
      } else if (addStatus === 0) { 
        this.activeStatus = 'neaktivan';
      } else {
        this.activeStatus = 'invalid'
      }
    } else {
      if (this.activeStatus.toLowerCase() == 'aktivan') {
        this.data.data.active = 1;
      } else if (this.activeStatus.toLowerCase() == 'neaktivan') {
        this.data.data.active = 0;
      } else {
        this.data.data.active = 2;
      }
    }
  }


  setType(event) {
    this.type = event;
    this.dialogRef.close(event)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateAdd(add) {
    this.setInputStatus(this.data.data.active, 'toNumber');
    this.dataSrv.updateAdd(add);
  }

  deleteAdd(id) {
    this.dataSrv.deleteAdd(id);
  }
}
