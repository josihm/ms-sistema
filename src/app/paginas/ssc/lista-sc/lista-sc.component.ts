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
import { SolicitudSCPI } from 'src/app/recursos/modelos/solicitudesscp.interface';
import { UsuarioInterface } from 'src/app/recursos/modelos/usuario.interface';
import { AuthService } from 'src/app/recursos/servicios/auth.service';
import { GenerarPDFService } from 'src/app/recursos/servicios/generar-pdf.service';
import { ServiciosService } from 'src/app/recursos/servicios/servicios.service';
import { SscService } from 'src/app/recursos/servicios/ssc.service';
import { ValidarFechas } from 'src/app/recursos/servicios/validarFechas';
import { SscComponent } from '../ssc.component';

@Component({
  selector: 'app-lista-sc',
  templateUrl: './lista-sc.component.html',
  styleUrls: ['./lista-sc.component.scss']
})
export class ListaScComponent implements OnInit {
  public usuarioActual$!: Observable<UsuarioInterface> | any;
  deptoSesion: Departamento = new Departamento();
  deptos: DepartamentoInterface[]=[];
  deptoInterface!: Observable<DepartamentoInterface> | any ;
  

  ssci: Observable<SolicitudSCPI> | any;
  arrSscpI: SolicitudSCPI[] = [];
  totalRegistros!: number;

  hoy!: string;
  mostla!: string;

  isAdmin = false;

  displayedColumns: string[] = ['folio', 'fechaSol', 
                      'departamento_id', 'remitente', 
                      'destino','destinatario',
                      'entrega','tCorrespondencia',
                      'tEnvio','acciones'];

  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private authServicio: AuthService,
              private servicios: ServiciosService, private scServicio: SscService,
              private matDialog: MatDialog,  private overlay: Overlay) {
    this.usuarioActual$ = this.authServicio.afAuth.user;
  }

  async ngOnInit(): Promise<void> {
    var logged = String(localStorage.getItem("isLogged")?.toString());
    if (logged=="false"){
      this.router.navigate(['login']);
    }else{
      this.deptoSesion = JSON.parse(String(localStorage.getItem("deptoSesion")));
      this.deptos = await this.authServicio.getDeptos_async();
      if(this.deptoSesion.departamento=="JARDINERÍA Y TRANSPORTES"){
        this.isAdmin=true;
      }else{
        this.isAdmin=false;
        this.arrSscpI = await this.scServicio.allSSCP_idDepto_async(String(this.deptoSesion.id));
        this.totalRegistros = this.arrSscpI.length;
        this.dataSource.data = await this.cambiarDepartamento_id_x_Departamento(this.arrSscpI, this.deptos);
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
    dialogConfig.data = this.servicios.selectedSC;
    dialogConfig.autoFocus = true;
    dialogConfig.scrollStrategy;
    dialogConfig.maxHeight = '360px';
    this.matDialog.open(SscComponent,dialogConfig);
  }

  toHome(){ this.router.navigate(["home"]); }

  sscHoy(){}

  sscMostla(){}

  total(){}

  add(){
    this.limpiarFormulario();
    //console.log("presionó en add(): ", this.servicios.selectedSC);
    this.openModal();
  }

  editar(element:any){
    if(element){
      alert("presionó en editar")
      var hoy = ValidarFechas.parseDateToStringWithFormat(new Date());
      const vf: ValidarFechas = new ValidarFechas(element.entrega, element.entrega, hoy);
      if( vf.validarFechas_SCP()){
        //console.log("ELEMENT: ", element);
        this.servicios.selectedSC = element;
        //console.log("element con await: ", element);
        //Cómo poner la fecha del DATE 
        //this.servicios.selectedST.salidaSt = ValidarFechas.convertirFechaToMatPicker(element.salidaSt);
        //this.servicios.selectedST.regresoSt = ValidarFechas.convertirFechaToMatPicker(element.regresoSt);
        this.openModal();
      }else{
        alert("No se puede modificar: Fecha pasada");
      }
    }
    this.ngOnInit();
  }

  async imprimir(element:any):Promise<void>{
    if (this.deptoSesion.departamento == "JARDINERÍA Y TRANSPORTES"){

    }else{
      this.ssci = await this.scServicio.getSSCP_xFolio(element.folio);
      //console.log("IMPRIME this.deptoSesion: ", this.deptoSesion);
      //console.log("IMPRIME element aka this.ssti: ", this.ssci);
      GenerarPDFService.generaPDF_SC(this.ssci,this.deptoSesion,Number(this.ssci.folio),this.ssci.id);
    }
    this.ngOnInit();
  }

  //async cambiarDepartamento_id_x_Departamento(arrSstI: SolicitudSTI[], deptos: DepartamentoInterface[]):Promise<SolicitudSTI[]>{
  async cambiarDepartamento_id_x_Departamento(arrSscI: SolicitudSCPI[], deptos: DepartamentoInterface[]):Promise<SolicitudSCPI[]>{
    return await new Promise(async (resuelve, rechaza) =>{
      try {
        for( var i=0; i< arrSscI.length; i++){
          for(var j = 0; j<this.deptos.length; j++){
            if (arrSscI[i].departamento_id == this.deptos[j].id){
              arrSscI[i].departamento_id = this.deptos[j].departamento;
            }
          }
        }
        return await resuelve(arrSscI);
      } catch (error) {
        return await rechaza(error.message);
      }
    });
    
    this.dataSource.data=arrSscI;
  }

  cambiarDepartamento_x_Departamento_id(arrSscI: SolicitudSCPI[]){
    for( var i=0; i< arrSscI.length; i++){
      for(var j = 0; j<this.deptos.length; j++){
        if (arrSscI[i].departamento_id == this.deptos[j].departamento){
          arrSscI[i].departamento_id = this.deptos[j].id;
        }
      }
    }
    this.dataSource.data=arrSscI;
  }

  cambia_Departamento_x_departamento_id(element: any){
    //console.log("elemento", element);
    return this.authServicio.getDeptoDepartamento(element.departamento_id)
              .where("departamento", "==", element.departamento_id)
              .get().then(doc=>{doc.forEach(
                    doc=>{
                      element.departamento_id=doc.id;
                      //console.log("element.departamento_id: ", element.departamento_id);
                      //console.log("element.folio: ", element.folio);
                      this.servicios.selectedSC = element;
                      this.servicios.selectedSC.entrega = ValidarFechas.convertirFechaToMatPicker(element.entrega);
                      //this.servicios.selectedSC.regresoSt = ValidarFechas.convertirFechaToMatPicker(element.regresoSt);
                    })
                  });
  }

  limpiarFormulario(){
    this.servicios.selectedSC.id!='',
    this.servicios.selectedSC.departamento_id = '';
    this.servicios.selectedSC.destino = '';
    this.servicios.selectedSC.folio = '';
    this.servicios.selectedSC.fechaSol = '';
    this.servicios.selectedSC.destinatario = '';
    this.servicios.selectedSC.remitente = '';
    this.servicios.selectedSC.entrega = '';
    this.servicios.selectedSC.cantidad = '';
    this.servicios.selectedSC.tCorrespondencia = '';
    this.servicios.selectedSC.tEnvio = '';
    this.servicios.selectedSC.infAd = '';
    this.servicios.selectedSC.formaEnvio = '';
    this.servicios.selectedSC.anexo = '';
  }

}
