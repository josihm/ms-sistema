import { Component, OnInit } from '@angular/core';
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
  constructor(private authServicio: AuthService,
              private deptoServicio: DepartamentoService) { }

  async ngOnInit(): Promise<void> {
    this.txtEncriptado = await EncriptarService.encrypt("aguilaJaguar");
    console.log("Probando encriptación: ", this.txtEncriptado);
    this.txtDesencriptado = await EncriptarService.desencriptar("U2FsdGVkX1+97ASkvOByfSNCxBXUkw5JUpKdXF/H/uo=");
    this.existeDepto = await this.deptoServicio.existeDepartamento("DIRECCIÓN");
    console.log("this.deptoServicio.existeDepartamento(): ", this.existeDepto);
    console.log("Probando desEncriptación: ", this.txtDesencriptado);
  }

}
