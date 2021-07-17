import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../auth.service';

export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FilterModalComponent>,
    auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
