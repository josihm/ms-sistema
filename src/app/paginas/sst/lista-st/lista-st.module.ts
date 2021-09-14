import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaStRoutingModule } from './lista-st-routing.module';
import { ListaStComponent } from './lista-st.component';


@NgModule({
  declarations: [ListaStComponent],
  imports: [
    CommonModule,
    ListaStRoutingModule
  ]
})
export class ListaStModule { }
