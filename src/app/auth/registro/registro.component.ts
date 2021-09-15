import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioInterface } from 'src/app/recursos/modelos/usuario.interface';
import { AuthService } from 'src/app/recursos/servicios/auth.service';
import { EncriptarService } from 'src/app/recursos/servicios/encriptar.service';
import { ServiciosService } from 'src/app/recursos/servicios/servicios.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  navigationExtras: NavigationExtras = {
    state: {
      usuario: null,
    }
  }
  usuarioLogged: UsuarioInterface;
  
  usuario!: UsuarioInterface ;
  usuario$!: Observable<UsuarioInterface> | any;

  formularioRegistroUsuario!: FormGroup;
  private isEmail = /\S+@+\S+\.\S/;
  private isExtensiones = /\d/;

  constructor(private router: Router,
            private fb: FormBuilder,
            private usuarioServicio: ServiciosService,
            private authServicio: AuthService) {
    const navigation = this.router.getCurrentNavigation();
    this.usuarioLogged = navigation?.extras?.state?.usuario;
  }

  ngOnInit(): void {
    this.initForm();
    
      
    console.log("usuario: ", this.usuario);
    if (typeof this.usuarioLogged != 'undefined'){
        this.router.navigate(['home']);
    }else{
      this.formularioRegistroUsuario.patchValue(this.usuario);
    }
    
    
  }

  private initForm():void{
    this.formularioRegistroUsuario = this.fb.group({
      email: new FormControl([''],[Validators.required, Validators.pattern(this.isEmail)]),
      psw: new FormControl([''],[Validators.required]),
      phoneNumber: new FormControl([''], [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(this.isExtensiones)]),
      displayName: new FormControl(['']),
    });
  }

  async registrar():Promise<void>{
    this.usuario = this.formularioRegistroUsuario.value;
    this.usuario.psw = await EncriptarService.encrypt(this.formularioRegistroUsuario.value.psw);
    if (this.formularioRegistroUsuario.valid) {
      const usuarioReg = this.formularioRegistroUsuario.value;
      const idUsuario = this.usuario?.id || null;

      this.usuario$ = await this.authServicio.registraPorfavor(usuarioReg);
      
      this.usuario.uid = this.usuario$;
      
      await this.usuarioServicio.guardarUsuarioPorFavorEnBD(this.usuario, idUsuario);
      
      this.formularioRegistroUsuario.reset();
      this.router.navigate(['home']);
    }else{
      alert('Falló el registro, revise los campos vacíos');
    }
  }

  isValid(campo: string):string{
    const validarCampo = this.formularioRegistroUsuario.get(campo);
    return (!validarCampo?.valid && validarCampo?.touched)
      ? 'es inválido' : validarCampo?.touched ? 'es válido' :  '';
  }
}

