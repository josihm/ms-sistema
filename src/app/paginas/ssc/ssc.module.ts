import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SscRoutingModule } from './ssc-routing.module';
import { SscComponent } from './ssc.component';


@NgModule({
  declarations: [SscComponent],
  imports: [
    CommonModule,
    SscRoutingModule
  ]
})
export class SscModule { }
