import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookService, InitParams } from 'ngx-facebook';
import { Observable } from 'rxjs';
import { AuthService } from './recursos/servicios/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  public usuarioActual$: Observable<any>;

  constructor(private router: Router, private authServicio: AuthService,
              private facebookService:FacebookService){
    this.usuarioActual$ = this.authServicio.afAuth.user;
  }
  
  ngOnInit(){
    this.initFacebookService();
    if(localStorage.getItem("isLogged")=="false" 
        || localStorage.getItem("isLogged") == null
        || localStorage.getItem("isLogged") == ''
        || localStorage.getItem("isLogged") == undefined){
      localStorage.setItem("isLogged", "false");
      this.router.navigate(['login']);
    }else{
      localStorage.setItem("isLogged", "true");
      this.router.navigate(['home']);
    }
  }
  private initFacebookService(): void {
    const initParams: InitParams = { xfbml:true, version:"v3.2"};
    this.facebookService.init(initParams);
  }
}
