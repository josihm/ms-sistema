import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SsinRoutingModule } from './ssin-routing.module';
import { SsinComponent } from './ssin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModule } from 'src/app/recursos/material/mat.module';

@NgModule({
  declarations: [SsinComponent],
  imports: [
    CommonModule,
    SsinRoutingModule, FormsModule, MatModule, ReactiveFormsModule, 
  ]
})
export class SsinModule { }
