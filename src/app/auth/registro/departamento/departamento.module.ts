import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartamentoRoutingModule } from './departamento-routing.module';
import { DepartamentoComponent } from './departamento.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [DepartamentoComponent],
  imports: [
    CommonModule,
    DepartamentoRoutingModule, ReactiveFormsModule, FormsModule
  ]
})
export class DepartamentoModule { }
