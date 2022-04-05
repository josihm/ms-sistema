import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SsdlRoutingModule } from './ssdl-routing.module';
import { SsdlComponent } from './ssdl.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModule } from 'src/app/recursos/material/mat.module';

@NgModule({
    declarations: [SsdlComponent],
    imports: [
      CommonModule,
      SsdlRoutingModule, MatModule, FormsModule, ReactiveFormsModule,
    ]
  })
  export class SsdlModule { }
  