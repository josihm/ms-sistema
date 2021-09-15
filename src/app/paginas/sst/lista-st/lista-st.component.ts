import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Departamento } from 'src/app/recursos/modelos/departamento.class';
import { DepartamentoInterface } from 'src/app/recursos/modelos/departamento.interface';
import { SolicitudSTI } from 'src/app/recursos/modelos/solicitudesst.interface';
import { UsuarioInterface } from 'src/app/recursos/modelos/usuario.interface';
import { AuthService } from 'src/app/recursos/servicios/auth.service';
import { GenerarPDFService } from 'src/app/recursos/servicios/generar-pdf.service';
import { ServiciosService } from 'src/app/recursos/servicios/servicios.service';
import { SstService } from 'src/app/recursos/servicios/sst.service';
import { ValidarFechas } from 'src/app/recursos/servicios/validarFechas';
import { SstComponent } from '../sst.component';

@Component({
  selector: 'app-lista-st',
  templateUrl: './lista-st.component.html',
  styleUrls: ['./lista-st.component.scss']
})
export class ListaStComponent implements OnInit {
  public usuarioActual$!: Observable<UsuarioInterface> | any;
  deptoSesion: Departamento = new Departamento();
  deptos: DepartamentoInterface[]=[];
  deptoInterface!: Observable<DepartamentoInterface> | any ;
  ssti: Observable<SolicitudSTI> | any;

  deptoConsultado!: DepartamentoInterface;

  trasladarDatos: any;

  totalRegistros!: number;
  arrSstI: SolicitudSTI[] = [];

  hoy!: string;
  mostla!: string;

  displayedColumns = ['folio', 'fechaSolicitud', 
                      'departamento_id', 'destino',
                      'salidaSt','regresoSt',
                      'tServicio','tTransporte','acciones'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private authServicio: AuthService,
              private servicios: ServiciosService,
              private stServicio: SstService,
              private matDialog: MatDialog,  private overlay: Overlay,
              ) {
    this.usuarioActual$ = this.authServicio.afAuth.user;
  }

  async ngOnInit():Promise<void>{
    var logged = String(localStorage.getItem("isLogged")?.toString());
    if (logged=="false"){
      this.router.navigate(['login']);
    }else{
      this.deptoSesion = JSON.parse(String(localStorage.getItem("deptoSesion")));
      console.log("this.deptoSesion.id: ",this.deptoSesion);
      this.deptos = await this.authServicio.getDeptos_async();
      console.log('todos los deptos: ', this.deptos);
      if(this.deptoSesion.departamento=="JARDINERÍA Y TRANSPORTES"){
        this.arrSstI = await this.stServicio.allSST_async();
        console.log('todas las sst: ', this.arrSstI);
        this.totalRegistros = this.arrSstI.length;
        this.dataSource.data = await this.cambiarDepartamento_id_x_Departamento(this.arrSstI, this.deptos);
      }else{
        this.arrSstI = await this.stServicio.getSSTs_deptoId_async(String(this.deptoSesion.id));
        this.totalRegistros = this.arrSstI.length;
        this.dataSource.data = await this.cambiarDepartamento_id_x_Departamento(this.arrSstI, this.deptos);
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openModal(): void{
    const dialogConfig = new MatDialogConfig();
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    //dialogConfig.data = this.servicios.selectedST;
    dialogConfig.data = '';
    dialogConfig.autoFocus = true;
    dialogConfig.scrollStrategy;
    dialogConfig.maxHeight = '480px';
    this.matDialog.open(SstComponent,dialogConfig);
  }
  
  add(){ 
    this.limpiarFormulario();
    this.openModal();
    //this.router.navigate(['solicitud-st']);
  }
  
  async editar(element: any){
    //this.openModal();
    if(element){
      var hoy = ValidarFechas.parseDateToStringWithFormat(new Date());
      const vf: ValidarFechas = new ValidarFechas(element.salidaSt, element.regresoSt, hoy);
      if( vf.validarFechas_SCP()){
        console.log("element: ", element);
        this.servicios.selectedST = element;
        //console.log("element con await: ", element);
        //Cómo poner la fecha del DATE 
        //this.servicios.selectedST.salidaSt = ValidarFechas.convertirFechaToMatPicker(element.salidaSt);
        //this.servicios.selectedST.regresoSt = ValidarFechas.convertirFechaToMatPicker(element.regresoSt);
        this.openModal();
      }else{
        alert("No se puede modificar la solicitud: Fecha anterior a hoy ")
      }
    }
    this.ngOnInit();
  }

  async imprimir(element: any){
    if (this.deptoSesion.departamento == "JARDINERÍA Y TRANSPORTES"){
      this.cambiarDepartamento_x_Departamento_id(this.arrSstI);
      this.deptoInterface = await this.authServicio.getDepto_async(element.departamento_id);
      this.ssti = await this.stServicio.getSST_id_async(element.id);
      console.log("IMPRIME this.deptoInterface: ", this.deptoInterface);
      console.log("IMPRIME element aka this.ssti: ", this.ssti);
      GenerarPDFService.generaPDF_ST(this.ssti,this.deptoInterface,Number(this.ssti.folio),this.ssti.id);
    }else{
      this.ssti = await this.stServicio.getSST_folio_async(element.folio);
      console.log("IMPRIME this.deptoSesion: ", this.deptoSesion);
      console.log("IMPRIME element aka this.ssti: ", this.ssti);
      GenerarPDFService.generaPDF_ST(this.ssti,this.deptoSesion,Number(this.ssti.folio),this.ssti.id);
    }
    this.ngOnInit();
  }

  async sstHoy(){
    this.hoy = ValidarFechas.fechaToString(new Date());
    this.dataSource.data = await this.stServicio.getColeccionSST_hoy(this.hoy);
    this.arrSstI = await this.stServicio.getColeccionSST_hoy(this.hoy);
    this.totalRegistros = this.arrSstI.length;
    this.cambiarDepartamento_id_x_Departamento(this.arrSstI, this.  deptos);
  }

  async sstMostla(){
    this.mostla = ValidarFechas.fechaMostlaToString(new Date());
    this.dataSource.data = await this.stServicio.getColeccionSST_hoy(this.mostla);
    this.arrSstI = await this.stServicio.getColeccionSST_hoy(this.mostla);
    this.totalRegistros = this.arrSstI.length;
    this.cambiarDepartamento_id_x_Departamento(this.arrSstI, this.deptos);
  }
  
  total(){
    return this.totalRegistros;
  }

  async cambiarDepartamento_id_x_Departamento(arrSstI: SolicitudSTI[], deptos: DepartamentoInterface[]):Promise<SolicitudSTI[]>{
    return new Promise( async (resuelve,rechaza) =>{
      try {
        for( var i=0; i< arrSstI.length; i++){
          for(var j = 0; j<deptos.length; j++){
            if (arrSstI[i].departamento_id == deptos[j].id){
              arrSstI[i].departamento_id = deptos[j].departamento;
            }
          }
        }
        //return resuelve(this.dataSource.data=arrSstI);
        return resuelve(arrSstI);
      } catch (error) {
        rechaza(error.message);
      }
    });
  }

  cambiarDepartamento_x_Departamento_id(arrSstI: SolicitudSTI[]){
    for( var i=0; i< arrSstI.length; i++){
      for(var j = 0; j<this.deptos.length; j++){
        if (this.arrSstI[i].departamento_id == this.deptos[j].departamento){
          arrSstI[i].departamento_id = this.deptos[j].id;
        }
      }
    }
    this.dataSource.data=arrSstI;
  }

  cambia_Departamento_x_departamento_id(element: any){
    console.log("elemento", element);
    return this.authServicio.getDeptoDepartamento(element.departamento_id)
              .where("departamento", "==", element.departamento_id)
              .get().then(doc=>{doc.forEach(
                    doc=>{
                      element.departamento_id=doc.id;
                      console.log("element.departamento_id: ", element.departamento_id);
                      console.log("element.folio: ", element.folio);
                      this.servicios.selectedST = element;
                      this.servicios.selectedST.salidaSt = ValidarFechas.convertirFechaToMatPicker(element.salidaSt);
                      this.servicios.selectedST.regresoSt = ValidarFechas.convertirFechaToMatPicker(element.regresoSt);
                    })
                  });
  }

  limpiarFormulario(){
    this.servicios.selectedST.id! = '';
    this.servicios.selectedST.departamento_id = '';
    this.servicios.selectedST.destino = '';
    this.servicios.selectedST.folio = '';
    this.servicios.selectedST.fechaSol = '';
    this.servicios.selectedST.salidaSt = '';
    this.servicios.selectedST.regresoSt = '';
    this.servicios.selectedST.horaS = '';
    this.servicios.selectedST.horaR = '';
    this.servicios.selectedST.tServicio = '';
    this.servicios.selectedST.tTransporte = '';
    this.servicios.selectedST.infAd = '';
    this.servicios.selectedST.nPasajeros = '';
    this.servicios.selectedST.pasajeros = '';
  }
}
