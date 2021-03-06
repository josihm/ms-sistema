import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Departamento } from 'src/app/recursos/modelos/departamento.class';
import { Horas } from 'src/app/recursos/modelos/horas.class';
import { SolicitudSTI } from 'src/app/recursos/modelos/solicitudesst.interface';
import { UsuarioInterface } from 'src/app/recursos/modelos/usuario.interface';
import { AuthService } from 'src/app/recursos/servicios/auth.service';
import { GenerarPDFService } from 'src/app/recursos/servicios/generar-pdf.service';
import { ServiciosService } from 'src/app/recursos/servicios/servicios.service';
import { SstService } from 'src/app/recursos/servicios/sst.service';
import { ValidarFechas } from 'src/app/recursos/servicios/validarFechas';

@Component({
  selector: 'app-sst',
  templateUrl: './sst.component.html',
  styleUrls: ['./sst.component.scss']
})
export class SstComponent implements OnInit {
  usuarioActual$: UsuarioInterface | any;
  deptoSesion: Departamento = new Departamento();
  
  ssti!: SolicitudSTI | any;
  folio!: number;

  validaFecha_async!: boolean;

  formularioSST!: FormGroup;
  private isEmail = /\S+@+\S+\.\S/;
  private isExtensiones = /\d/;

  horas: Horas[]=[
    { value: '07:00', viewValue: '07:00'},
    { value: '07:15', viewValue: '07:15'},
    { value: '07:30', viewValue: '07:30'},
    { value: '07:45', viewValue: '07:45'},
    { value: '08:00', viewValue: '08:00'},
    { value: '08:15', viewValue: '08:15'},
    { value: '08:30', viewValue: '08:30'},
    { value: '08:45', viewValue: '08:45'},
    { value: '09:00', viewValue: '09:00'},
    { value: '09:15', viewValue: '09:15'},
    { value: '09:30', viewValue: '09:30'},
    { value: '09:45', viewValue: '09:45'},
    { value: '10:00', viewValue: '10:00'},
    { value: '10:15', viewValue: '10:15'},
    { value: '10:30', viewValue: '10:30'},
    { value: '10:45', viewValue: '10:45'},
    { value: '11:00', viewValue: '11:00'},
    { value: '11:15', viewValue: '11:15'},
    { value: '11:30', viewValue: '11:30'},
    { value: '11:45', viewValue: '11:45'},
    { value: '12:00', viewValue: '12:00'},
    { value: '12:15', viewValue: '12:15'},
    { value: '12:30', viewValue: '12:30'},
    { value: '12:45', viewValue: '12:45'},
    { value: '13:00', viewValue: '13:00'},
    { value: '13:15', viewValue: '13:15'},
    { value: '13:30', viewValue: '13:30'},
    { value: '13:45', viewValue: '13:45'},
    { value: '14:00', viewValue: '14:00'},
    { value: '14:15', viewValue: '14:15'},
    { value: '14:30', viewValue: '14:30'},
    { value: '14:45', viewValue: '14:45'},
    { value: '15:00', viewValue: '15:00'},
    { value: '15:15', viewValue: '15:15'},
    { value: '15:30', viewValue: '15:30'},
    { value: '15:45', viewValue: '15:45'},
    { value: '16:00', viewValue: '16:00'},
    { value: '16:15', viewValue: '16:15'},
    { value: '16:30', viewValue: '16:30'},
    { value: '16:45', viewValue: '16:45'},
    { value: '17:00', viewValue: '17:00'},
    { value: '17:15', viewValue: '17:15'},
    { value: '17:30', viewValue: '17:30'},
    { value: '17:45', viewValue: '17:45'},
    { value: '18:00', viewValue: '18:00'},
    { value: '18:15', viewValue: '18:15'},
    { value: '18:30', viewValue: '18:30'},
    { value: '18:45', viewValue: '18:45'},
    { value: '19:00', viewValue: '19:00'},
    { value: '19:15', viewValue: '19:15'},
    { value: '19:30', viewValue: '19:30'},
    { value: '19:45', viewValue: '19:45'},
    { value: '20:00', viewValue: '20:00'},
    { value: '20:15', viewValue: '20:15'},
    { value: '20:30', viewValue: '20:30'},
    { value: '20:45', viewValue: '20:45'},
    { value: '21:00', viewValue: '21:00'},
    { value: '21:15', viewValue: '21:15'},
    { value: '21:30', viewValue: '21:30'},
    { value: '21:45', viewValue: '21:45'},
  ]

  //dataSource = new MatTableDataSource<FormGroup>(this.datos);
  
  matcher = new ErrorStateMatcher();

  constructor(private router: Router, private authServicio: AuthService,
              public servicios: ServiciosService,
              private stServicio: SstService,
              private dialogRef: MatDialogRef<SstComponent>,
              @Inject(MAT_DIALOG_DATA) public datos: any,
              ) { 
    this.usuarioActual$ = this.authServicio.afAuth.user;
  }

  isErrorState(control: FormControl, form: FormGroupDirective | NgForm | null): boolean {
    //throw new Error('Method not implemented.');
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
  
  async ngOnInit(): Promise<void> {
    this.deptoSesion = JSON.parse(String(localStorage.getItem("deptoSesion")));
    if(this.deptoSesion.uid==undefined){
      this.router.navigate(['login']);
    }else{
      //this.servicios.selectedST.departamento_id = await this.authServicio.getIdDeptoXdepartamento(this.servicios.selectedST.departamento_id);
      //this.servicios.selectedST = await this.stServicio.getSST_folio_async(this.servicios.selectedST.folio);
      if (this.servicios.selectedST.folio==""||undefined||null){
        //CUANDO VIENE VAC??O o es nuevo desde la lista
        console.log("PRESION?? en el bot??n NUEVO o ADD")
        this.limpiarFormulario();//MODIFICADO EN LA NOCHE DEL 13 de SEP 2021
      }else{
        this.ssti = await this.stServicio.getSST_folio_async(this.servicios.selectedST.folio) 
                || await this.stServicio.getSST_id_async(this.servicios.selectedST.id)
                || '';
        this.servicios.selectedST = this.ssti;
        
        var salidast = ValidarFechas.convertirFechaStringToMatPicker(this.servicios.selectedST.salidaSt)
        var regresost = ValidarFechas.convertirFechaStringToMatPicker(this.servicios.selectedST.regresoSt);

        this.servicios.selectedST.salidaSt =  ValidarFechas.parseDateToStringWithFormat(salidast);
        this.servicios.selectedST.regresoSt = ValidarFechas.parseDateToStringWithFormat(regresost);
        
        //console.log("datos traidos de la lista this.formularioSST.value: ", this.formularioSST.value);
        //console.log("datos traidos de la lista this.servicios.selectedSt: ", this.servicios.selectedST);
        //console.log("datos traidos de la lista this.ssti: ", this.ssti);
        //console.log("Convertir fecha string a Date: ", ValidarFechas.convertirFechaStringToMatPicker(this.ssti.salidaSt));
      }
      
    }
  }

  async guardar():Promise<void>{

    if (this.servicios.selectedST.id == null
      || this.servicios.selectedST.id == ''
      || this.servicios.selectedST.id == undefined){
        //
        //console.log("guardar() IF this.servicios.selectedST: ", this.servicios.selectedST);
        //console.log("guardar() IF this.formularioSST.value: ", this.formularioSST.value);
        this.ssti = this.servicios.selectedST;
        
        //console.log("this.ssti: ", this.ssti);

        this.formatearFechas();


        this.ssti.departamento_id = this.deptoSesion.id;

        //console.log("antes del async boolena this.ssti: ", this.ssti);

        this.validaFecha_async = await this.stServicio.getSTColeccionFiltradaBoolean_async(this.ssti);

        //console.log("valida: ", this.validaFecha_async);
        
        if(this.validaFecha_async){

          this.folio = await this.stServicio.getNumeroFolioSiguiente_async();
          this.ssti.folio = this.folio;
          //console.log("Proceder a registrar la solicitud !!!", this.ssti);
          //console.log("del Departamento !!!", this.deptoSesion);
          await this.stServicio.addUpdate(this.ssti);
          
          await GenerarPDFService.generaPDF_ST(this.ssti,this.deptoSesion,Number(this.ssti.folio),this.ssti.id);
          //this.limpiarFormulario();
          this.router.navigate(['solicitudes-st']);
          alert("Registro guardado, verificar!!!");
          this.close
        }else{
          alert("Algo sucedi?? mal");
          this.close();
        }
        //this.stServicio.addUpdate(this.servicios.selectedST);
    }else{
      //this.formularioSST.value.salidaSt = ValidarFechas.fechaToString(new Date(Date.parse(this.formularioSST.value.salidaSt)));
      //this.formularioSST.value.regresoSt = ValidarFechas.fechaToString(new Date(Date.parse(this.formularioSST.value.regresoSt)));
      //this.servicios.editSST(this.formularioSST.value);
      //this.servicios.selectedST.departamento_id = await this.authServicio.getIdDeptoXdepartamento(this.servicios.selectedST.departamento_id);
      //console.log("guardar() ELSE this.servicios.selectedST: ", this.servicios.selectedST);
      //console.log("guardar() ELSE this.formularioSST.value: ", this.formularioSST.value);
      
      this.formatearFechas();

      this.validaFecha_async = await this.stServicio.getSTColeccionFiltradaBoolean_async(this.ssti);
      //TIENE QUE MANDAR TRUE
      //console.log("primera validacion: ", this.validaFecha_async);
      //console.log("de la fecha de salida: ", this.ssti.salidaSt);
      const otravalidacion = await this.validar(this.ssti);
      if (otravalidacion){
        if(this.ssti.folio!=null || this.ssti.folio!="" 
            && (this.deptoSesion.uid!=null || this.deptoSesion.uid!=undefined)){
          //console.log("Proceder a actualizar la solicitud !!!", this.ssti);
          //console.log("del Departamento !!!", this.deptoSesion);
          await this.stServicio.addUpdate(this.ssti);
          
          await GenerarPDFService.generaPDF_ST(this.ssti,this.deptoSesion,Number(this.ssti.folio),this.ssti.id);
          this.close();
          alert("Registro actualizado, verificar!!!");
        }else{
          alert("Fechas no v??lidas!!!");
        }
      }
    }
    this.close();
  }

  async validar(ssti: SolicitudSTI):Promise<boolean>{
    return await new Promise(async (resuelve, rechaza)=>{
      try {
        const vf: ValidarFechas = new ValidarFechas(this.ssti.salidaSt, this.ssti.regresoSt, this.ssti.fechaSol);
        
        if (vf.validarFechas() 
            ){
            alert("Fechas v??lidas y con espacio para asignar");
            return await resuelve(true);
        }else{
          //const dia = vf.getDiaDeLaSemana();
          //alert("Fecha de salida no v??lida: "+dia);
          return await resuelve(false);
        }    
      } catch (error) {
        //console.log("Error de validaci??n: ", error.message);
        return await rechaza(false);
      }
    });
    
  }

  formatearFechas(){
    this.servicios.selectedST.fechaSol = ValidarFechas.parseDateToStringWithFormat(new Date());
      var salst = Date.parse(this.servicios.selectedST.salidaSt);
      var regst = Date.parse(this.servicios.selectedST.regresoSt);
      var hoy = new Date();
      var dateSalida = this.servicios.selectedST.salidaSt;
      var dateRegreso = this.servicios.selectedST.regresoSt;

      this.servicios.selectedST.salidaSt = ValidarFechas.fechaToString(new Date(salst));
      this.servicios.selectedST.regresoSt = ValidarFechas.fechaToString(new Date(regst));

      this.ssti = this.servicios.selectedST;
      this.ssti.fechaSolImp = ValidarFechas.parseDateToStringWithFormat_Imprimir(new Date());
      this.ssti.dateSalida = dateSalida;
      this.ssti.dateRegreso = dateRegreso;
      this.ssti.dateFechaSol = new Date(hoy);
  }

  close(): void{
    this.dialogRef.close();
    this.router.navigate(['solicitudes-st']);
    this.limpiarFormulario();
  }

  limpiarFormulario(){
    this.servicios.selectedST.id='',
    this.servicios.selectedST.departamento_id = '';
    this.servicios.selectedST.folio = '';
    this.servicios.selectedST.destino = '';
    this.servicios.selectedST.salidaSt = '';
    this.servicios.selectedST.regresoSt = '';
    this.servicios.selectedST.horaS = '';
    this.servicios.selectedST.horaR = '';
    this.servicios.selectedST.fechaSol = '';
    this.servicios.selectedST.tServicio = '';
    this.servicios.selectedST.tTransporte = '';
    this.servicios.selectedST.infAd = '';
    this.servicios.selectedST.pasajeros = '';
    this.servicios.selectedST.nPasajeros = '';
  }
}
