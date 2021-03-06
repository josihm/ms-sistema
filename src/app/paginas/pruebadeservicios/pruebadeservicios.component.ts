import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartamentoInterface } from 'src/app/recursos/modelos/departamento.interface';
import { UsuarioInterface } from 'src/app/recursos/modelos/usuario.interface';
import { AuthService } from 'src/app/recursos/servicios/auth.service';
import { DepartamentoService } from 'src/app/recursos/servicios/departamento.service';
import { EncriptarService } from 'src/app/recursos/servicios/encriptar.service';

@Component({
  selector: 'app-pruebadeservicios',
  templateUrl: './pruebadeservicios.component.html',
  styleUrls: ['./pruebadeservicios.component.scss']
})
export class PruebadeserviciosComponent implements OnInit {
  existeDepto!: boolean;

  txtEncriptado!:string;
  txtDesencriptado!: string;

  depto: Observable<DepartamentoInterface> | any;
  usuario: Observable<UsuarioInterface> | any;

  constructor(private authServicio: AuthService,
              private deptoServicio: DepartamentoService) { }

  async ngOnInit(): Promise<void> {
    /*
    this.txtEncriptado = await EncriptarService.encrypt("aguilaJaguar");
    console.log("Probando encriptación: ", this.txtEncriptado);
    this.txtDesencriptado = await EncriptarService.desencriptar("U2FsdGVkX1+97ASkvOByfSNCxBXUkw5JUpKdXF/H/uo=");
    this.existeDepto = await this.deptoServicio.existeDepartamento("DIRECCIÓN");
    console.log("this.deptoServicio.existeDepartamento(): ", this.existeDepto);
    console.log("Probando desEncriptación: ", this.txtDesencriptado);
    */
    this.usuario = await this.authServicio.logIN("josihm.unam@gmail.com","aguilajagua");
    if (this.usuario){
      console.log("autentificado: ", this.usuario.uid)
    }else{
      alert("falló autenticación");
      console.log("VERICAR: ", this.usuario);
    }
  }

}
