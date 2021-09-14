import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PruebadeserviciosRoutingModule } from './pruebadeservicios-routing.module';
import { PruebadeserviciosComponent } from './pruebadeservicios.component';


@NgModule({
  declarations: [PruebadeserviciosComponent],
  imports: [
    CommonModule,
    PruebadeserviciosRoutingModule
  ]
})
export class PruebadeserviciosModule { }
