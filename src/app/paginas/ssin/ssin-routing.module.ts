import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SsinComponent } from './ssin.component';

const routes: Routes = [{ path: '', component: SsinComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SsinRoutingModule { }
