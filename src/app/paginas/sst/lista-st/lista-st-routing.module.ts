import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaStComponent } from './lista-st.component';

const routes: Routes = [{ path: '', component: ListaStComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaStRoutingModule { }
