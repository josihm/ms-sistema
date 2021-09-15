import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn, QuerySnapshot } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SolicitudSCPI } from '../modelos/solicitudesscp.interface';
import { SolicitudSTI } from '../modelos/solicitudesst.interface';
import { UsuarioInterface } from '../modelos/usuario.interface';

import * as firebase from 'firebase';
import { GenerarPDFService } from './generar-pdf.service';
import { DepartamentoInterface } from '../modelos/departamento.interface';
import { Departamento } from '../modelos/departamento.class';

type CollectionPredicate<T> = string | AngularFirestoreCollection;

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private unSubscribe$ = new Subject<void>();
  public selectedST = {
    id!: '',
    folio: '',
    departamento_id: '',
    destino: '',
    salidaSt: '',
    regresoSt: '',
    horaS: '',
    horaR: '',
    fechaSol: '',
    tServicio: '',
    tTransporte: '',
    infAd: '',
    nPasajeros: '',
    pasajeros: '',

    dateSalida!: Date,
    dateRegreso!: Date,
    dateFechaSol!: Date,
  };

  public selectedSC = {
    id!: '',
    folio: '',
    departamento_id: '',
    remitente: '',
    destinatario: '',
    destino: '',
    entrega: '',
    tCorrespondencia: '',
    tEnvio: '',
    formaEnvio: '',
    cantidad: '',
    fechaSol: '',
    infAd: '',
    anexo: '',

    dateEntrega!: Date,
    dateFechaSol!: Date,
  }

  private coleccionUsuarios: AngularFirestoreCollection<UsuarioInterface> | any;
  private coleccionSST: AngularFirestoreCollection<SolicitudSTI> | any;
  private coleccionSSTs: AngularFirestoreCollection<SolicitudSTI>;
  private coleccionSSC: AngularFirestoreCollection<SolicitudSCPI>;

  ssts!: Observable<SolicitudSTI[]>;
  sscps: Observable<SolicitudSCPI[]>;

  sstss: Observable<SolicitudSTI[]>;

  private usuario$: Observable<UsuarioInterface> | any;

  constructor(private afs: AngularFirestore) { 
    this.coleccionUsuarios = this.afs.collection<UsuarioInterface>('usuarios');
    
    this.coleccionSST = this.afs.collection<SolicitudSTI>('solicitudesst');
    this.coleccionSSTs = this.afs.collection<SolicitudSTI>('solicitudesst');
    this.coleccionSSC = this.afs.collection<SolicitudSCPI>('solicitudessc');

    /*this.ssts = this.coleccionSST.get().then((querySnapshot: any[]) => {
        querySnapshot.forEach((doc: { id: any; data: () => any; }) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    });*/

    /*this.ssts = this.coleccionSST.snapshotChanges()
                    .pipe(map(actions=>actions.map(a=>{
                      const data = a.payload.doc.data() as SolicitudSTI;
                      const id = a.payload.doc.id;
                      return {id, ...data};
                    })))
    ;*/

    this.sstss = this.coleccionSSTs.snapshotChanges()
                                .pipe(map(actions=>actions.map(a=>{
                                  const data = a.payload.doc.data() as SolicitudSTI;
                                  const id = a.payload.doc.id;
                                  return {id, ...data};
                                })))
    ;

    this.sscps = this. coleccionSSC.snapshotChanges()
                                  .pipe(map(actions => actions.map(a=>{
                                    const data = a.payload.doc.data() as SolicitudSCPI;
                                    const id = a.payload.doc.id;
                                    return {id, ...data};
                                  })))
    ;
  }

  allSST(){return this.sstss;}
  allSSCP(){return this.sscps;}

  async guardarUsuario(usuario: UsuarioInterface, idUsuario:string|null|"null"|''):Promise<void>{
    return new Promise(async (resolve,reject) => {
      try {
        const id = idUsuario || this.afs.createId();
        const data = { id, ...usuario};
        const respuesta = await this.coleccionUsuarios.doc(id).set(data);
        resolve(respuesta);
      } catch (error) {
        reject(error.message);
      }
    });
  }

  async guardarUsuarioPorFavorEnBD(usuario: UsuarioInterface, idUsuario:string|null|"null"|''):Promise<void>{
    return new Promise(async (resolve,reject) => {
      try {
        const id = idUsuario || this.afs.createId();
        const data = { id, ...usuario};
        const respuesta = await this.coleccionUsuarios.doc(id).set(data);
        resolve(respuesta);
      } catch (error) {
        reject(error.message);
      }
    });
  }

  addSST(ssti: SolicitudSTI){ this.coleccionSST.add(ssti); }
  
  async addSST_async(ssti: SolicitudSTI, idSst:string, deptoSesion:Departamento):Promise<void>{
    return new Promise(async (resolve,reject) => {
      try {
        const id = idSst || this.afs.createId();
        const data = { id, ...ssti};
        const respuesta = await this.coleccionSST.doc(id).set(data);
        GenerarPDFService.generaPDF_ST(ssti,deptoSesion,Number(ssti.folio),id);
        resolve(respuesta);
      } catch (error) {
        reject(error.message);
      }
    });
  }

  async editSST(ssti: SolicitudSTI){}

  getSST_folio_eImprime(ssti: SolicitudSTI, deptoSesion:Departamento){
    this.addSST(ssti);
    this.coleccionSST.ref
      .where("folio ", "==", ssti.folio.toString())
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((respuesta: any)=>{
        console.log(respuesta[0].id);
        GenerarPDFService.generaPDF_ST(ssti,deptoSesion,Number(ssti.folio),respuesta[0].id);
      });
    ;
  }

  async getFolioST_async():Promise<number>{
    return new Promise(async(resolve, reject) => {
      try {
        //const respuesta = this.coleccionSST.get().subscribe((folio: { size: number; })=>{return folio.size+1});
        const respuesta = this.coleccionSST.get().subscribe((datos: { size: number; })=>{
          //console.log("getFolioST_async() folio: ", datos.size+1);
          resolve( datos.size+1 );
        });;
        //resolve(respuesta);
        //resolve( datos.size+1 );
      } catch (error) {
        reject(error.message);
      }
    });
  }
  
  async getFolio_asyncN():Promise<number>{
    return await this.coleccionSST.get().subscribe(async (datos: { size: number; }) => {
      return await datos.size + 1;
    });
    //return 0;
  }
  getFolioST(){
    return this.coleccionSST.get();
  }

  async getSTColeccion_async(ssti: SolicitudSTI):Promise<boolean>{
    return await this.coleccionSST.ref
      .where("salidaSt", "==", ssti.salidaSt)
      .where("horaS", "==", ssti.horaS).get()
      .then(async (query: any[]) => {
        query.forEach(function (doc) {
        });
        if (query.length >= 3) {
          return await false;
        } else {
          return await true;
        }
      }).catch(function (error: any) {
        console.log("error al obtener la info.", error);
      });
    //return await firebase.default.firestore.CollectionReference;
  }

  async getSTColeccion(){
    return await this.coleccionSST.ref;
  }

  async getColeccionSSTDepto(idDepto:string){
    return await this.coleccionSST.ref.where("departamento_id", "==", idDepto).get();
  }

  async getSST_id_async(idSST: string){
    return await this.coleccionSST.doc(idSST).get();
  }

  private coleccion<T>(ref: CollectionPredicate<T>, querySnapshot?: QueryFn<firebase.default.firestore.DocumentData> | undefined): AngularFirestoreCollection{
    return typeof ref === "string"? this.afs.collection(ref,querySnapshot): ref;
  }

  coleccion$<T>(ref: CollectionPredicate<T>, queryFn?: QueryFn<firebase.default.firestore.DocumentData> | undefined): Observable<any>{
    return this.coleccion(ref,queryFn).snapshotChanges().pipe(
      map(docs => {
         return docs.map(d => {
           const data = d.payload.doc.data();
           const id = d.payload.doc.id;
           return  { id, ...data}
         })
      })
    );
  }

}
