import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaStRoutingModule } from './lista-st-routing.module';
import { ListaStComponent } from './lista-st.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModule } from 'src/app/recursos/material/mat.module';


@NgModule({
  declarations: [ListaStComponent],
  imports: [
    CommonModule,
    ListaStRoutingModule, ReactiveFormsModule, FormsModule, MatModule
  ]
})
export class ListaStModule { }
