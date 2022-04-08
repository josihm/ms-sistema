import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaScComponent } from './lista-sc.component';

const routes: Routes = [{ path: '', component: ListaScComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaScRoutingModule { }
