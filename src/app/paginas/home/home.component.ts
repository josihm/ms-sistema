import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { Departamento } from 'src/app/recursos/modelos/departamento.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLogged: boolean = false;
  deptoSesion: Departamento = new Departamento();
  constructor(private router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("isLogged")=="false" 
        || localStorage.getItem("isLogged") == null
        || localStorage.getItem("isLogged") == ''
        || localStorage.getItem("isLogged") == undefined){
      this.isLogged = false;
      this.router.navigate(["login"]);
    }else{
      this.isLogged = true;
      this.deptoSesion = JSON.parse(String(localStorage.getItem("deptoSesion")));
    }
  }

}
