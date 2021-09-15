import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartamentoRoutingModule } from './departamento-routing.module';
import { DepartamentoComponent } from './departamento.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [DepartamentoComponent],
  imports: [
    CommonModule,
    DepartamentoRoutingModule, ReactiveFormsModule
  ]
})
export class DepartamentoModule { }
