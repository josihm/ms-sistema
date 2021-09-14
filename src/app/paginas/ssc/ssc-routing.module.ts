import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SscComponent } from './ssc.component';

const routes: Routes = [{ path: '', component: SscComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SscRoutingModule { }
