import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Departamento } from 'src/app/recursos/modelos/departamento.class';
import { UsuarioInterface } from 'src/app/recursos/modelos/usuario.interface';
import { AuthService } from 'src/app/recursos/servicios/auth.service';
import { ServiciosService } from 'src/app/recursos/servicios/servicios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private usuarioActual?: Observable<UsuarioInterface> | any;
  //deptoSesion: Observable<DepartamentoInterface>;
  deptoSel: Departamento | any = new Departamento();
  
  formularioLogin = new FormGroup({
      correo: new FormControl(''),
      psw: new FormControl('')
    }
  );

  constructor(private router: Router, private afAuth: AuthService, private servicio: ServiciosService) { }

  ngOnInit(): void {
  }

  async signIn(){
    //console.log('datos->formularioLogin: ', this.formularioLogin.value);
    try {
      const {correo, psw} = this.formularioLogin.value;
      this.usuarioActual = await this.afAuth.logIn(correo, psw);
      //await this.afAuth.loginGoogle();
      if (this.usuarioActual){
        this.router.navigate(['home']);
        //console.log("async singIn() -> this.usuarioActual: ", this.usuarioActual);
        //console.log("async singIn() -> this.usuarioActual.id: ", this.usuarioActual.id);
        //console.log("async singIn() -> this.usuarioActual.uid: ", this.usuarioActual.uid);
        //console.log("async singIn() -> this.usuarioActual.displayName: ", this.usuarioActual.displayName);

        await this.afAuth.signIn(this.usuarioActual.uid)
          .where("uid", "==", this.usuarioActual.uid)
          .get().then(doc=>{
            doc.forEach(doc=>{
              //console.log(doc.id);
              this.deptoSel = doc.data();
              this.deptoSel.id = doc.id;
              let deptoSesion = JSON.stringify(this.deptoSel);
              localStorage.setItem("deptoSesion", deptoSesion);
              localStorage.setItem("isLogged", "true");
              //console.log("this.deptoSel: ", this.deptoSel);
              //console.log("let deptoSesion: ", deptoSesion);
              //console.log("localStorage.getItem ", localStorage.getItem("deptoSesion"));
              this.router.navigate(['home']);
            })
          });

      }else{
        alert("Verifique usuario y contraseña!!!")
        //console.log("Usuario no registrado");
      }
    } catch (error) {
      console.log("error en signIn() del LoginComponent: ", error)
    }
  }

}
