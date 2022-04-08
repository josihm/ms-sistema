import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaScRoutingModule } from './lista-sc-routing.module';
import { ListaScComponent } from './lista-sc.component';
import { MatModule } from 'src/app/recursos/material/mat.module';


@NgModule({
  declarations: [ListaScComponent],
  imports: [
    CommonModule,
    ListaScRoutingModule, MatModule,
  ]
})
export class ListaScModule { }
