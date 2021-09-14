import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SstRoutingModule } from './sst-routing.module';
import { SstComponent } from './sst.component';


@NgModule({
  declarations: [SstComponent],
  imports: [
    CommonModule,
    SstRoutingModule
  ]
})
export class SstModule { }
