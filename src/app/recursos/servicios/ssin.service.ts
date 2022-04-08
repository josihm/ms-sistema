import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { SolicitudSIn } from '../modelos/ssin.interface';

@Injectable({
  providedIn: 'root'
})
export class SsinService {
  ssin!: Observable<SolicitudSIn> | any;
  sscin!: Observable<SolicitudSIn[]>;

  private coleccionSSIn: AngularFirestoreCollection<SolicitudSIn> | any;

  arregloSSIn: SolicitudSIn[]=[];

  numerodeFolio!: number;

 constructor(private afs: AngularFirestore) { 
    this.coleccionSSIn = firebase.default.firestore().collection("solicitudessin");
  }
	
  async allSSIn_async():Promise<SolicitudSIn[]>{
    this.arregloSSIn = [];
    return await new Promise(async(resuelve, rechaza) => {
      try {
        await this.coleccionSSIn.orderBy("folio").get()
                    .then((query: any[])=>{
                      query.forEach(doc=>{
                        this.arregloSSIn.push(doc.data());
                      })
                      return resuelve(this.arregloSSIn);
                    });
      } catch (error:any) {
        return rechaza(error.message);
      }
    });
  }

  async allSSIn_idDepto_async(idDepto: string):Promise<SolicitudSIn[]>{
    this.arregloSSIn = [];
    return await new Promise(async (resuelve, rechaza) => {
      try {
        await this.coleccionSSIn.where("departamento_id", "==", idDepto)
                    .get().then((busqueda: any[]) =>{
                      busqueda.forEach(doc=>{
                        this.arregloSSIn.push(doc.data());
                      })
                    });
                    return resuelve(this.arregloSSIn);
      } catch (error:any) {
        return rechaza(error.message);
      }
    })
  }

  async getSSInNumeroFolioSiguiente_async():Promise<number>{
    this.arregloSSIn = [];
    return await new Promise(async (resolve,reject) =>{
      try {
        await this.coleccionSSIn.get().then((querySnapshot: any[]) => {
          querySnapshot.forEach((doc: any) => {
              this.arregloSSIn.push(doc);
          });
          this.numerodeFolio = this.arregloSSIn.length+1;
          return resolve(this.numerodeFolio);
        })
      } catch (error:any) {
        reject(error.message);
      }
    });
  }

  async getSSIn_xId_async(idSsin: string):Promise<SolicitudSIn>{
    return await new Promise(async (resuelve, rechaza) => {
      try {
        await this.coleccionSSIn.doc(idSsin)
                    .get().then((busqueda: any)=>{
                      if(busqueda.exists){
                        this.ssin = busqueda.data();
                        return resuelve(this.ssin);
                      }
                    });
      } catch (error:any) {
        rechaza(error.message);
      }
    });
  }

  async getSSIn_xFolio(folio: string):Promise<SolicitudSIn>{
    return await new Promise(async (resuelve, rechaza) => {
      try {
        await this.coleccionSSIn.where("folio", "==", folio)
                    .get().then((busqueda: any[])=>{
                      busqueda.forEach(doc=>{
                        this.ssin = doc.data();
                        return resuelve(this.ssin);
                      })
                    });
      } catch (error:any) {
        return rechaza(error.message);
      }
    });
  }

  async addUpdate(ssin: SolicitudSIn):Promise<void>{
    return new Promise( async (resuelve, rechaza) => {
      try {
        const id = ssin.id || this.afs.createId();
        ssin.id = id;
        const data = { id, ...ssin};
        
        const respuesta = await this.coleccionSSIn.doc(id).set(data);
        return resuelve(respuesta);
      } catch (error:any) {
        return rechaza(error.message);
      }
    } );
  }

}
