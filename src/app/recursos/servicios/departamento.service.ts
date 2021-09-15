import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { resolve } from 'dns';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DepartamentoInterface } from '../modelos/departamento.interface';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  deptosI!: Observable<DepartamentoInterface[]>;

  depto$!: Observable<DepartamentoInterface> | any;
  depto!: DepartamentoInterface;

  idDepto!: string;

  todoslosDepartamentos: DepartamentoInterface[] = []
  
  private coleccionDeptos: AngularFirestoreCollection<DepartamentoInterface>  | any;

  constructor(private readonly afs: AngularFirestore) { 
    //this.coleccionDeptos = this.afs.collection<DepartamentoInterface>('deptos');
    this.coleccionDeptos = firebase.default.firestore().collection('departamentos');
    this.getDeptos();
  }
  
  async getDeptos():Promise<DepartamentoInterface[]>{
    this.todoslosDepartamentos = [];
    return await new Promise(async (resuelve,rechaza)=>{
      try {
        await this.coleccionDeptos.get()
                    .then((busqueda: DepartamentoInterface[])=>{
                      busqueda.forEach((doc: DepartamentoInterface)=>{
                      this.todoslosDepartamentos.push(doc);
        });
        return resuelve(this.todoslosDepartamentos);
        });
      } catch (error) {
        return await rechaza(error.message);
      }
    });
  }

  async getDeptoxID(id: string):Promise<DepartamentoInterface>{
    return await new Promise(async (resuelve,rechaza)=>{
      try {
        await this.coleccionDeptos.doc(id).get()
                    .then((doc: { exists: any; data: () => Observable<DepartamentoInterface>; })=>{
                      if(doc.exists){
                        this.depto$ = doc.data();
                        return resuelve(this.depto$);
                      }else{
                        alert("No se encontró el documento");
                      }
                    });
      } catch (error) {
        return rechaza(error.message);
      }
    });
  }

  async getDeptoxUID(uid: string):Promise<DepartamentoInterface>{
    return await new Promise(async (resuelve,rechaza)=>{
      try {
        await this.coleccionDeptos.where("uid", "==", uid).get()
                    .then((busqueda: any)=>{
                      busqueda.forEach((doc: any)=>{
                        this.depto$ = doc.data();
                        return resuelve(this.depto$);
                      });
                    });
      } catch (error) {
        return await rechaza(error.message);
      }
    });
  }

  async saberIDxnombreDepartamento(departamento: string):Promise<string>{
    return await new Promise(async (resuelve,rechaza)=>{
      try {
        await this.coleccionDeptos.where("departamento","==",departamento)
                    .get().then((busqueda:any)=>{
                      busqueda.forEach((doc:any)=>{
                        this.idDepto = doc.data();
                        return resuelve(this.idDepto);
                      })
                    });
      } catch (error) {
        return await rechaza(error.message);
      }
    });
  }

  async existeDepartamento(depto: string):Promise<boolean>{
    return await new Promise(async (resuelve,rechaza)=>{
      try {
        await this.coleccionDeptos.where("departamento", "==", depto)
                  .get().then((busqueda:any)=>{
                    busqueda.forEach((doc: any)=>{
                      this.depto = doc.data();
                    })
                    if(this.depto){
                      return resuelve(true);
                    }else{
                      return resuelve(false);
                    }
                  });
      } catch (error) {
        return await rechaza(error.message);
      }
    });
  }

  async xDefinir(uid: string):Promise<DepartamentoInterface>{
    return await new Promise(async (resuelve,rechaza)=>{
      try {
        
      } catch (error) {
        return await rechaza(error.message);
      }
    });
  }

  async guardar(depto: DepartamentoInterface, idDepto: string|null|"null"|''):Promise<void>{
    return new Promise(async (resolve,reject) => {
      try {
        const id = idDepto || this.afs.createId();
        const data = { id, ...depto};
        const respuesta = await this.coleccionDeptos.doc(id).set(data);
        resolve(respuesta);
      } catch (error) {
        reject(error.message);
      }
    });
    
  }

  async eliminarDepto(idDepto:string): Promise<void>{
    return new Promise(async (resolve,reject) => {
      try {
        const respuesta = await this.coleccionDeptos.doc(idDepto).delete();
        resolve(respuesta)
      } catch (error) {
        reject(error.message);
      }
    });
  }

}
