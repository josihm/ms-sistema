import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FacebookModule } from 'ngx-facebook';
import { environment } from 'src/environments/environment';
import { MatModule } from './recursos/material/mat.module';
import { AuthService } from './recursos/servicios/auth.service';
import { ServiciosService } from './recursos/servicios/servicios.service';
import { HeaderComponent } from './paginas/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule, FormsModule,
    MatModule, 
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FacebookModule.forRoot()
  ],
  providers: [
    AngularFirestore, AuthService, ServiciosService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
