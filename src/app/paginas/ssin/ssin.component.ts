import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Departamento } from 'src/app/recursos/modelos/departamento.class';
import { SolicitudSCPI } from 'src/app/recursos/modelos/solicitudesscp.interface';
import { SolicitudSIn } from 'src/app/recursos/modelos/ssin.interface';
import { UsuarioInterface } from 'src/app/recursos/modelos/usuario.interface';
import { AuthService } from 'src/app/recursos/servicios/auth.service';
import { GenerarPDFService } from 'src/app/recursos/servicios/generar-pdf.service';
import { ServiciosService } from 'src/app/recursos/servicios/servicios.service';
import { SscService } from 'src/app/recursos/servicios/ssc.service';
import { SsinService } from 'src/app/recursos/servicios/ssin.service';
import { ValidarFechas } from 'src/app/recursos/servicios/validarFechas';

@Component({
  selector: 'app-ssc',
  templateUrl: './ssc.component.html',
  styleUrls: ['./ssc.component.scss']
})
export class SsinComponent implements OnInit {

  usuarioActual$: UsuarioInterface | any;
  deptoSesion: Departamento = new Departamento();
  
  ssin!: SolicitudSIn | any;
  folio!: number;

  constructor(public router: Router, public servicios: ServiciosService, 
              private authServicio: AuthService, private siServicio: SsinService,
              private dialogRef: MatDialogRef<SsinComponent>,
              @Inject(MAT_DIALOG_DATA) public datos: any,) {
    this.usuarioActual$ = this.authServicio.afAuth.user;
  }

  async ngOnInit(): Promise<void> {
    this.deptoSesion = JSON.parse(String(localStorage.getItem("deptoSesion")));
    if(this.deptoSesion.uid==undefined){
      this.router.navigate(['login']);
    }else{
      //this.servicios.selectedST.departamento_id = await this.authServicio.getIdDeptoXdepartamento(this.servicios.selectedST.departamento_id);
      //this.servicios.selectedST = await this.stServicio.getSST_folio_async(this.servicios.selectedST.folio);
      if (this.servicios.selectedSC.folio==""||undefined||null){
        //CUANDO VIENE VACíO o es nuevo desde la lista
        //console.log("PRESIONó en el botón NUEVO o ADD");
        this.limpiarFormulario();
      }else{
        this.ssin = await this.siServicio.getSSIn_xFolio(this.servicios.selectedSC.folio) 
                || await this.siServicio.getSSIn_xId_async(this.servicios.selectedSC.id)
                || '';
        this.servicios.selectedSC = this.ssin;
        var entrega = ValidarFechas.convertirFechaStringToMatPicker(this.servicios.selectedSC.entrega)
        this.servicios.selectedSC.entrega =  ValidarFechas.parseDateToStringWithFormat(entrega);

        //console.log("datos traidos de la lista this.servicios.selectedSC: ", this.servicios.selectedSC);
        //console.log("datos traidos de la lista this.ssci: ", this.ssci);
        //console.log("Convertir fecha string a Date: ", ValidarFechas.convertirFechaStringToMatPicker(this.ssci.entrega));
      }
    }
  }

  async guardar(): Promise<void>{
    //console.log("guardar() -> ", this.servicios.selectedSC);
    if(this.servicios.selectedSC.id==''||this.servicios.selectedSC.id==null||
        this.servicios.selectedSC==undefined){
     // console.log("guardar() IF this.servicios.selectedSC: ", this.servicios.selectedSC);
      this.ssin = this.servicios.selectedSC;
      this.formatearFechas();
      this.ssin.departamento_id = this.deptoSesion.id;

      if(await this.validar(this.ssin)){
        this.folio = await this.siServicio.getSSInNumeroFolioSiguiente_async();
          this.ssin.folio = this.folio;
          //console.log("Proceder a registrar la solicitud !!!", this.ssci);
          //console.log("del Departamento !!!", this.deptoSesion);
          await this.siServicio.addUpdate(this.ssin);
          alert("Registro guardado, verificar!!!");
          GenerarPDFService.generaPDF_SC(this.ssin,this.deptoSesion,Number(this.ssin.folio),this.ssin.id);
          //this.limpiarFormulario();
          
      }else{
        alert("Algo sucedió mal");
      }
    }else{
      //console.log("guardar() ELSE this.servicios.selectedST: ", this.servicios.selectedST);
      //console.log("guardar() ELSE this.formularioSST.value: ", this.formularioSST.value);
      
      this.formatearFechas();
      
      if (await this.validar(this.ssin)){
        if(this.ssin.folio!=null || this.ssin.folio!="" 
            && (this.deptoSesion.uid!=null || this.deptoSesion.uid!=undefined)){
          //console.log("Proceder a actualizar la solicitud !!!", this.ssci);
          //console.log("del Departamento !!!", this.deptoSesion);
          await this.siServicio.addUpdate(this.ssin);
          alert("Registro actualizado, verificar!!!");
          GenerarPDFService.generaPDF_SC(this.ssin,this.deptoSesion,Number(this.ssin.folio),this.ssin.id);
          this.limpiarFormulario();
          
        }else{
          alert("Fechas no válidas!!!");
        }
      }
    }this.close();
  }

  async validar(ssin: SolicitudSIn):Promise<boolean>{
    const vf: ValidarFechas = new ValidarFechas(this.ssin.entrega, this.ssin.entrega, this.ssin.fechaSol);
    if (vf.validarFechas_SCP()){
      alert("Fecha de entrega válida");
      return await true;
    }else{
      alert("No se puede validar la fecha de entrega: Registrar al menos 1 día antes para la entrega. Favor de cancelar Solicitud o modificar fecha");
      return await false;
    }
  }

  formatearFechas(){
    this.servicios.selectedSC.fechaSol = ValidarFechas.parseDateToStringWithFormat(new Date());
      var salst = Date.parse(this.servicios.selectedSC.entrega);
      
      var hoy = new Date();
      var dateEntrega = this.servicios.selectedSC.entrega;
      
      this.servicios.selectedSC.entrega = ValidarFechas.fechaToString(new Date(salst));
      
      this.ssin = this.servicios.selectedSC;
      this.ssin.fechaSolImp = ValidarFechas.parseDateToStringWithFormat_Imprimir(new Date());
      this.ssin.dateEntrega = dateEntrega;
      this.ssin.dateFechaSol = new Date(hoy);
  }

  close(): void{
    this.dialogRef.close();
    this.router.navigate(['solicitudes-sc']);
    //this.limpiarFormulario();
  }

  limpiarFormulario():void{
    this.servicios.selectedSIn.id='',
    this.servicios.selectedSIn.departamento_id = '';
    this.servicios.selectedSIn.folio = '';
    this.servicios.selectedSIn.fechaSol = '';
    this.servicios.selectedSIn.tServicio = '';
    this.servicios.selectedSIn.infAd = '';
    this.servicios.selectedSIn.obs = '';
    this.servicios.selectedSIn.fechaCompromiso='',
    this.servicios.selectedSIn.fechaConformidad='',
    this.servicios.selectedSIn.acuse=''
  }
}
