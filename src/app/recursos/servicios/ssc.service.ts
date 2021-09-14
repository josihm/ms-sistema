import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { SolicitudSCPI } from '../modelos/solicitudesscp.interface';

@Injectable({
  providedIn: 'root'
})
export class SscService {
  ssci!: Observable<SolicitudSCPI> | any;
  sscis!: Observable<SolicitudSCPI[]>;

  private coleccionSSC: AngularFirestoreCollection<SolicitudSCPI> | any;

  arregloSSCP: SolicitudSCPI[]=[];

  numerodeFolio!: number;

  constructor(private afs: AngularFirestore) { 
    this.coleccionSSC = firebase.default.firestore().collection("solicitudessc");
  }

  async allSSCP_async():Promise<SolicitudSCPI[]>{
    this.arregloSSCP = [];
    return await new Promise(async(resuelve, rechaza) => {
      try {
        await this.coleccionSSC.orderBy("folio").get()
                    .then((query: any[])=>{
                      query.forEach(doc=>{
                        this.arregloSSCP.push(doc.data());
                      })
                      return resuelve(this.arregloSSCP);
                    });
      } catch (error) {
        return rechaza(error.message);
      }
    });
  }

  async allSSCP_idDepto_async(idDepto: string):Promise<SolicitudSCPI[]>{
    this.arregloSSCP = [];
    return await new Promise(async (resuelve, rechaza) => {
      try {
        await this.coleccionSSC.where("departamento_id", "==", idDepto)
                    .get().then((busqueda: any[]) =>{
                      busqueda.forEach(doc=>{
                        this.arregloSSCP.push(doc.data());
                      })
                    });
                    return resuelve(this.arregloSSCP);
      } catch (error) {
        return rechaza(error.message);
      }
    })
  }

  async getSSCNumeroFolioSiguiente_async():Promise<number>{
    this.arregloSSCP = [];
    return await new Promise(async (resolve,reject) =>{
      try {
        await this.coleccionSSC.get().then((querySnapshot: any[]) => {
          querySnapshot.forEach((doc: any) => {
              this.arregloSSCP.push(doc);
          });
          this.numerodeFolio = this.arregloSSCP.length+1;
          return resolve(this.numerodeFolio);
        })
      } catch (error) {
        reject(error.message);
      }
    });
  }

  async getSSCP_xId_async(idSscp: string):Promise<SolicitudSCPI>{
    return await new Promise(async (resuelve, rechaza) => {
      try {
        await this.coleccionSSC.doc(idSscp)
                    .get().then((busqueda: any)=>{
                      if(busqueda.exists){
                        this.ssci = busqueda.data();
                        return resuelve(this.ssci);
                      }
                    });
      } catch (error) {
        rechaza(error.message);
      }
    });
  }

  async getSSCP_xFolio(folio: string):Promise<SolicitudSCPI>{
    return await new Promise(async (resuelve, rechaza) => {
      try {
        await this.coleccionSSC.where("folio", "==", folio)
                    .get().then((busqueda: any[])=>{
                      busqueda.forEach(doc=>{
                        this.ssci = doc.data();
                        return resuelve(this.ssci);
                      })
                    });
      } catch (error) {
        return rechaza(error.message);
      }
    });
  }

  async getSTColeccionFiltradaBoolean_async(ssci: SolicitudSCPI):Promise<boolean>{
    return await this.coleccionSSC.ref
      .where("entrega", "==", ssci.entrega).get()
      .then(async (query: any[]) => {
        query.forEach(function (doc) {
        });
        if (query.length >= 1) {
          return await false;
        } else {
          return await true;
        }
      }).catch(function (error: any) {
        console.log("error al obtener la info.", error);
      });
  }

  async addUpdate(ssci: SolicitudSCPI):Promise<void>{
    return new Promise( async (resuelve, rechaza) => {
      try {
        const id = ssci.id || this.afs.createId();
        ssci.id = id;
        const data = { id, ...ssci};
        
        const respuesta = await this.coleccionSSC.doc(id).set(data);
        return resuelve(respuesta);
      } catch (error) {
        return rechaza(error.message);
      }
    } );
  }
}
