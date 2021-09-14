import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { SolicitudSTI } from '../modelos/solicitudesst.interface';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class SstService {
  ssti!: Observable<SolicitudSTI> | any;
  sstis!: Observable<SolicitudSTI[]>;

  arrSstI: SolicitudSTI[] = [];//SE PUEDE UTILIZAR UN SOLO ARRAY, HAY QUE INICIALIZARLO EN CADA FUNCION
  arregloSST: SolicitudSTI[]=[];

  arrSstIFolio: SolicitudSTI[] = [];
  arrSstI_filtrado: SolicitudSTI[] = [];
  todaslasSSTI: SolicitudSTI[] = [];
  numerodeFolio: number | undefined;



  private coleccionSST: AngularFirestoreCollection<SolicitudSTI> | any;
  private coleccionSSTafs: AngularFirestoreCollection<SolicitudSTI> | any;

  constructor(public afs: AngularFirestore) {
    this.coleccionSST = firebase.default.firestore().collection("solicitudesst");
    this.coleccionSSTafs = this.afs.collection<SolicitudSTI>("solicitudesst")
   }

   async allSST_async():Promise<SolicitudSTI[]>{
     this.arregloSST = [];
     return await new Promise(async (resolve, reject) => {
       try {
        await this.coleccionSST.orderBy("folio", "desc").get().then((querySnapshot: any[]) => {
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              this.todaslasSSTI.push(doc.data());
              this.arregloSST.push(doc.data());
          });
          //resolve(this.todaslasSSTI);
          return resolve(this.arregloSST); 
        });
       } catch (error) {
         return reject(error.message);
       }
     });
   }

   async allSST_orden_async():Promise<SolicitudSTI[]>{
    this.arregloSST = await this.coleccionSST.orderBy("folio");
    return this.arregloSST
  }

   async getSST_id_async(id:string):Promise<SolicitudSTI>{
     return await new Promise(async (resolve, reject)=>{
       try {
        const respuesta = await this.coleccionSST.doc(id).get().then((doc: { exists: any; data: () => SolicitudSTI; }) => {
          if (doc.exists) {
              //console.log("Datos de la solicitud de servicio de transporte:", doc.data());
              this.ssti = doc.data();
              return resolve(this.ssti);
          } else {
              // doc.data() will be undefined in this case
              console.log("No existe el documento !");
          }
        }).catch((error: any) => {
          console.log("Error al obtener el documento:", error);
        });
       } catch (error) {
        return reject(error.message);
       }
     });
   }

   async getSST_folio_async(folio:string):Promise<SolicitudSTI>{
    return await new Promise(async (resolve, reject)=>{
      try {
       const respuesta = await this.coleccionSST.where("folio","==",folio)
                .get().then((querySnapshot: any[]) => {
                  querySnapshot.forEach((doc) => {
                      // doc.data() is never undefined for query doc snapshots
                      //console.log(doc.id, " => ", doc.data());
                      this.ssti = doc.data();
                      return resolve(this.ssti)
                  });
              
       }).catch((error: any) => {
         console.log("Error al obtener el documento:", error);
       });
      } catch (error) {
       return reject(error.message);
      }
    });
  }

  async getSSTs_deptoId_async(deptoId:string):Promise<SolicitudSTI[]>{
    this.arregloSST = [];
    return await new Promise(async (resolve, reject)=>{
      try {
       const respuesta = await this.coleccionSST.where("departamento_id","==",deptoId)
                .get().then((querySnapshot: any[]) => {
                  querySnapshot.forEach((doc) => {
                      // doc.data() is never undefined for query doc snapshots
                      //console.log(doc.id, " => ", doc.data());
                      this.arrSstI.push(doc.data());
                      this.arregloSST.push(doc.data());
                  });
                  //return resolve(this.arrSstI);
                  return resolve(this.arregloSST);
       }).catch((error: any) => {
         console.log("Error al obtener el documento:", error);
       });
      } catch (error) {
       return reject(error.message);
      }
    });
  }

  async getNumeroFolioSiguiente_async():Promise<number>{
    this.arregloSST = [];
    return await new Promise(async (resolve,reject) =>{
      try {
        await this.coleccionSST.get().then((querySnapshot: any[]) => {
          querySnapshot.forEach((doc: any) => {
              this.arrSstIFolio.push(doc);
              this.arregloSST.push(doc);
          });
          //this.numerodeFolio = this.arrSstIFolio.length+1;
          this.numerodeFolio = this.arregloSST.length+1;
          return resolve(this.numerodeFolio);
        })
      } catch (error) {
        reject(error.message);
      }
    });
  }

  async getSTColeccionFiltradaBoolean_async(ssti: SolicitudSTI):Promise<boolean>{
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
  }

  async getSTColeccionFiltradaNum_async(ssti: SolicitudSTI):Promise<Number>{
    this.arregloSST = [];
    return new Promise(async(resolve, reject) => {
      try {
        await this.coleccionSST
                .where("salidaSt", "==", ssti.salidaSt)
                .where("horaS", "==", ssti.horaS).get()
                .then((query: any) => {
                  query.forEach((doc: any)=>{
                    this.arrSstI_filtrado.push(doc);
                    this.arregloSST.push(doc.data());
                  })
                  //return resolve(this.arrSstI_filtrado.length);
                  return resolve(this.arregloSST.length);
                });
      } catch (error) {
        reject(error.message);
      }
    });
  }

  async getColeccionSST_hoy(mostla: string):Promise<SolicitudSTI[]>{
    this.arregloSST = [];
    return new Promise(async (resuelve, rechaza) => {
      try {
        await this.coleccionSST.where("salidaSt", "==", mostla)
                      .get().then((query:any) =>{
                        query.forEach((doc:any) => {
                          this.arregloSST.push(doc.data());
                        })
                        return resuelve(this.arregloSST);
                      }
        );
      } catch (error) {
        return rechaza(error.message);
      }
    });
  }

  async addUpdate(ssti: SolicitudSTI):Promise<void>{
    return new Promise( async (resuelve, rechaza) => {
      try {
        const id = ssti.id || this.afs.createId();
        ssti.id = id;
        const data = { id, ...ssti};
        
        const respuesta = await this.coleccionSST.doc(id).set(data);
        return resuelve(respuesta);
      } catch (error) {
        return rechaza(error.message);
      }
    } );
  }
}
