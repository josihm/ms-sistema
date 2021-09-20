import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/recursos/servicios/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public usuarioActual$: Observable<any>;
  
  constructor(private router: Router, private authServicio: AuthService) {
    this.usuarioActual$ = this.authServicio.afAuth.user;
  }

  ngOnInit(): void {
  }

  logIn(){}

  logOut(){
    try {
      this.authServicio.logOut();
      localStorage.removeItem("deptoSesion");
      localStorage.removeItem("isLogged");
      localStorage.setItem("deptoSesion", "");
      localStorage.setItem("isLogged", "false");
      this.router.navigate(['/login']);
    } catch (error) {
      console.log('error en el logout() del Header: ', error);
    } 
  }

}
