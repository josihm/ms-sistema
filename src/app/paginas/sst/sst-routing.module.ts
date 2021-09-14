import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SstComponent } from './sst.component';

const routes: Routes = [{ path: '', component: SstComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SstRoutingModule { }
