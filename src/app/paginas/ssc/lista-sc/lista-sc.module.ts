import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaScRoutingModule } from './lista-sc-routing.module';
import { ListaScComponent } from './lista-sc.component';


@NgModule({
  declarations: [ListaScComponent],
  imports: [
    CommonModule,
    ListaScRoutingModule
  ]
})
export class ListaScModule { }
