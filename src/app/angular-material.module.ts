import {NgModule} from '@angular/core';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule, MatDialogModule,
} from '@angular/material';

const MODULES_LIST = [
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule,
];

@NgModule({
  exports: MODULES_LIST
})
export class AngularMaterialModule {

}
