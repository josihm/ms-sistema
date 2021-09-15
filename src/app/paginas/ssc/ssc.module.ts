import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SscRoutingModule } from './ssc-routing.module';
import { SscComponent } from './ssc.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModule } from 'src/app/recursos/material/mat.module';

@NgModule({
  declarations: [SscComponent],
  imports: [
    CommonModule,
    SscRoutingModule, FormsModule, MatModule, ReactiveFormsModule, 
  ]
})
export class SscModule { }
