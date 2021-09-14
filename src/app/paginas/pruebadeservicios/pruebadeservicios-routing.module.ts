import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PruebadeserviciosComponent } from './pruebadeservicios.component';

const routes: Routes = [{ path: '', component: PruebadeserviciosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PruebadeserviciosRoutingModule { }
