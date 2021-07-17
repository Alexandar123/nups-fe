import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphComponent } from './graph/graph.component';
import { ListingComponent } from './listing/listing.component';
import { MapComponent } from './map/map.component';
import { TableComponent } from './table/table.component';

import { GoogleMapsModule } from '@angular/google-maps';
import { LocationComponent } from './location/location.component';
import { MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatTableModule, MatButtonModule, MatSliderModule, MatAutocompleteModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { Ng5SliderModule } from 'ng5-slider';
import { ModalComponent } from './modal/modal.component';
import { AddTypeModalComponent } from './add-type-modal/add-type-modal.component';
// import { ExportAsModule } from 'ngx-export-as';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { ConfirmModalComponent } from 'src/app/confirm-modal/confirm-modal.component';
import { LocationModalComponent } from './location-modal/location-modal.component';

export function dialogClose(): Function {
  return (dialogResult: any) => { }
}
@NgModule({
  declarations: [
    GraphComponent,
    ListingComponent,
    MapComponent,
    TableComponent,
    LocationComponent,
    ModalComponent,
    AddTypeModalComponent,
    ConfirmModalComponent,
    LocationModalComponent

  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    // ChartModule,
    FormsModule,
    GoogleMapsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatSliderModule,
    MatAutocompleteModule,
    MatDialogModule,
    AgmCoreModule,
    Ng5SliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LeafletModule,
    LeafletDrawModule,
    LeafletMarkerClusterModule
  ],
  exports: [
    GraphComponent,
    ListingComponent,
    MapComponent,
    TableComponent,
    LocationComponent,
    ConfirmModalComponent
  ],
  entryComponents: [
    GraphComponent,
    ListingComponent,
    MapComponent,
    TableComponent,
    LocationComponent,
    ModalComponent,
    AddTypeModalComponent,
    ConfirmModalComponent,
    LocationModalComponent],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {
        close: dialogClose
      }
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {
        close: dialogClose
      }
    }

  ]
})
export class FilterModule { }
