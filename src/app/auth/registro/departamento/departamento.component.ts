import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Departamento } from 'src/app/recursos/modelos/departamento.class';
import { DepartamentoInterface } from 'src/app/recursos/modelos/departamento.interface';
import { UsuarioInterface } from 'src/app/recursos/modelos/usuario.interface';
import { AuthService } from 'src/app/recursos/servicios/auth.service';
import { DepartamentoService } from 'src/app/recursos/servicios/departamento.service';
import { EncriptarService } from 'src/app/recursos/servicios/encriptar.service';
import { ServiciosService } from 'src/app/recursos/servicios/servicios.service';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.scss']
})
export class DepartamentoComponent implements OnInit {
  navigationExtras: NavigationExtras = {
    state: {
      departamento: null,
    }
  }

  depto!: DepartamentoInterface | any;
  deptoSel: Departamento | any = new Departamento();


  usuario!: UsuarioInterface;
  usuario$!: Observable<UsuarioInterface> | any;

  existeDepto: boolean = false;
  txtEncriptado!: string;

  formularioRegistroDepartamento!: FormGroup;
  private isEmail = /\S+@+\S+\.\S/;
  private isExtensiones = /\d/;

  confirmapsw!: string;
  
  constructor(private router: Router, private authServicio: AuthService,
              private usuarioServicio: ServiciosService,
              private fb: FormBuilder,
              private deptoServicio: DepartamentoService) { 
    const navigation = this.router.getCurrentNavigation();
    this.depto = navigation?.extras?.state?.departamento;
  }

  ngOnInit(): void {
    this.initForm();
    //console.log("this.depto: ", this.depto);
    if (typeof !this.depto === undefined){
      this.router.navigate(['/home']);
    }else{
      this.formularioRegistroDepartamento.patchValue(this.depto);
    }
  }

  private initForm():void{
    this.formularioRegistroDepartamento = this.fb.group({
      //departamento: new FormControl([''], [Validators.required]),
      departamento: new FormControl(['']),
      //titular: new FormControl([''],[Validators.required]),
      titular: new FormControl(['']),
      //correosind: new FormControl([''],[Validators.required, Validators.pattern(this.isEmail)]),
      correosind: new FormControl(['']),
      //teldirecto: new FormControl([''],[Validators.minLength(10), Validators.maxLength(10), Validators.pattern(this.isExtensiones)]),
      teldirecto: new FormControl(['']),
      //extensiones:[{
        //ext: new FormControl(['']!,[Validators.minLength(5), Validators.maxLength(5), Validators.pattern(this.isExtensiones)]),
        ext: new FormControl(['']),
        //ext2: new FormControl(['']!,[Validators.minLength(5), Validators.maxLength(5), Validators.pattern(this.isExtensiones)]),
        ext2: new FormControl(['']),
      //,
      //psw: new FormControl([''],[Validators.required]),
      psw: new FormControl(['']),
      
    });
  }

  async registrar():Promise<void>{
    //console.log('registrar() -> ', this.formularioRegistroDepartamento.value);
    //console.log(this.formularioRegistroDepartamento.valid);

    console.log("psw y confirmapsw: ", this.formularioRegistroDepartamento.value.psw, this.confirmapsw)
    
    if (this.formularioRegistroDepartamento.value.psw === this.confirmapsw){
      this.depto = this.formularioRegistroDepartamento.value;
      this.txtEncriptado = await EncriptarService.encrypt("aguilaJaguar");
      //this.depto.psw = await EncriptarService.encrypt(this.depto.psw);

      //console.log("this.depto: ", this.depto);
      const usuarioRegistro = {
        email: this.formularioRegistroDepartamento.value.correosind,
        psw: this.formularioRegistroDepartamento.value.psw,
        displayName: this.depto.titular,
        phoneNumber: this.depto.teldirecto,
      } 
      this.usuario = usuarioRegistro;
      this.depto.psw = await EncriptarService.encrypt(this.txtEncriptado);
      /*
      this.usuario.email = this.depto.correosind;
      this.usuario.psw = this.formularioRegistroDepartamento.value.psw;
      this.usuario.displayName = this.depto.titular;
      this.usuario.phoneNumber = this.depto.teldirecto;
      */
      //console.log("this.usuario: ", this.usuario);

      if (this.formularioRegistroDepartamento.valid) {
        const idDepto = this.depto?.id || null;

        const usuarioReg = this.usuario;
        const idUsuario = this.usuario?.id || null;

        this.existeDepto = await this.deptoServicio.existeDepartamento(this.depto.departamento);
        //console.log("this.existeDepto: ",this.existeDepto);

        if(this.existeDepto){
          alert("Ya existe un registro con ese Departamento");
          this.formularioRegistroDepartamento.reset();
        }else{

          this.usuario$ = await this.authServicio.registraPorfavor(usuarioReg);
          
          this.usuario.uid = this.usuario$;
          this.depto.uid = this.usuario$;
          
          await this.usuarioServicio.guardarUsuarioPorFavorEnBD(this.usuario, idUsuario);

          await this.deptoServicio.guardar(this.depto, idDepto);

          this.depto = await this.deptoServicio.getDeptoxUID(String(this.usuario.uid));
          let deptoSesion = JSON.stringify(this.depto);
          localStorage.setItem("deptoSesion", deptoSesion);
          localStorage.setItem("isLogged", "true");
          
          this.formularioRegistroDepartamento.reset();
          this.router.navigate(['home']);
        }
      }else{
        alert('Falló el registro');
        console.log('Algo salió mal');
        this.formularioRegistroDepartamento.reset();
      }
    }else{
      alert("Contraseñas distintas. Verificar!!!");
    }
  }

  isValid(campo: string):string{
    const validarCampo = this.formularioRegistroDepartamento.get(campo);
    return (!validarCampo?.valid && validarCampo?.touched)
      ? 'es inválido' : validarCampo?.touched ? 'es válido' :  '';
  }
}