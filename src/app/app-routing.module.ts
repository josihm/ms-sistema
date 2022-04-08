import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: 'home', loadChildren: () => import('./paginas/home/home.module').then(m => m.HomeModule) },
  { path: 'login', loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule) },
  { path: 'registro', loadChildren: () => import('./auth/registro/registro.module').then(m => m.RegistroModule) },
  { path: 'registroDepto', loadChildren: () => import('./auth/registro/departamento/departamento.module').then(m => m.DepartamentoModule) },
  { path: 'solicitud-st', loadChildren: () => import('./paginas/sst/sst.module').then(m => m.SstModule) }, 
  { path: 'solicitudes-st', loadChildren: () => import('./paginas/sst/lista-st/lista-st.module').then(m => m.ListaStModule) },
  { path: 'solicitudes-sc', loadChildren: () => import('./paginas/ssc/lista-sc/lista-sc.module').then(m => m.ListaScModule) },
  { path: 'solicitud-sc', loadChildren: () => import('./paginas/ssc/ssc.module').then(m => m.SscModule) },
  { path: 'solicitud-sdl', loadChildren: () => import('./paginas/ssdl/ssdl.module').then(m=> m.SsdlModule) },
  { path: 'solicitud-sin', loadChildren: () => import('./paginas/ssin/ssin.module').then(m=> m.SsinModule) },
  { path: 'pds', loadChildren: () => import('./paginas/pruebadeservicios/pruebadeservicios.module').then(m => m.PruebadeserviciosModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
