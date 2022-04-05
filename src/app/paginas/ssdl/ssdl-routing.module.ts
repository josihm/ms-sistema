import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SsdlComponent } from './ssdl.component';

const routes: Routes = [{ path: '', component: SsdlComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SsdlRoutingModule { }
