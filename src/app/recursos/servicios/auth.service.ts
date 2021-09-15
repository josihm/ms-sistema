import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable, of, Subject } from 'rxjs';
import { first, map, switchMap, takeUntil } from 'rxjs/operators';
import { DepartamentoInterface } from '../modelos/departamento.interface';
import { SolicitudSTI } from '../modelos/solicitudesst.interface';
import { UsuarioInterface } from '../modelos/usuario.interface';
import { EncriptarService } from './encriptar.service';
import { GenerarPDFService } from './generar-pdf.service';
import { ServiciosService } from './servicios.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private unSubscribe$ = new Subject<void>();
  //public usuario$: Observable<UsuarioInterface> | any;
  private usuario$: Observable<UsuarioInterface> | any;
  //private usuario: Observable<UsuarioInterface> | any;
  coleccionDeptos!: AngularFirestoreCollection<DepartamentoInterface>;
  coleccionDeptosFirestore: AngularFirestoreCollection<DepartamentoInterface> | any;
  departamentos: Observable<DepartamentoInterface[]>;
  deptoInterface: Observable<DepartamentoInterface> | any;
  ssti: Observable<SolicitudSTI> | any;

  deptos: DepartamentoInterface[]=[];
  depto: DepartamentoInterface | any;

  idDepto: string | any;

  constructor(public afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private usuarioServicio: ServiciosService,
              private servicios: ServiciosService) {
    
    this.coleccionDeptos = this.afs.collection<DepartamentoInterface>('departamentos');
    this.coleccionDeptosFirestore = firebase.default.firestore().collection('departamentos');
    this.departamentos = this.coleccionDeptos.snapshotChanges()
                            .pipe(map ((actions: any[])=> actions.map(a=>{
                                const id = a.payload.doc.id;
                                const data = a.payload.doc.data() as DepartamentoInterface;
                                return {id, ...data};
                              })));
    
    this.usuario$ = this.afAuth.authState.pipe(
      switchMap( (user) => {
        if(user){
          return this.afs.doc<UsuarioInterface>('usuarios/${usuario$.uid}').valueChanges();
        }
        return of(null);
      })
    );
  }
  
  async logIn(correo: string, psw: string):Promise<any>{
    try{
      this.usuario$ = await firebase.default.auth().signInWithEmailAndPassword(correo,psw)
        .then((userCredential) => { 
          var user = userCredential.user;
          this.usuario$ = user;
          return this.usuario$;
        })
        .catch((error) => {});
      return this.usuario$;
    }catch(error){
      console.log('error');
    }
  }
  
  async logIn2(correo:string, psw:string):Promise<any>{
    try{
      this.usuario$ = await firebase.default.auth().signInWithEmailAndPassword(correo, psw)
        .then((user) => {
          console.log("Usuario: ", user);
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            var uid = user.user?.uid;
            this.usuario$ = user.user;
            //this.usuario$.uid = user.user?.uid;
            console.log("Usuario: ", user);
            console.log("ID: ", this.usuario$.id);
            console.log("UID: ", this.usuario$.uid);
            console.log("EMAIL: ", this.usuario$.email);
            console.log("DISPLAYNAME: ", this.usuario$.displayName);
            console.log("EMAILVerified: ", this.usuario$.emailVerified);
            console.log("photoURL: ", this.usuario$.photoURL);
            //return this.usuario$;
            // ...
          } else {
            // User is signed out
            // ...
          }
      });
      return this.usuario$;
    } catch (error) {
      console.log('error logIn: ', error);
    }
  }

  async logIn3(correo: string, psw: string):Promise<any>{
    try {
      this.usuario$  = await this.afAuth.signInWithEmailAndPassword(correo,psw);
      //this.actualizarRol(this.usuario);
      console.log("login3() -> Usuario: ", this.usuario$);
      return this.usuario$;
    } catch (error) {
      console.log('error logIn: ', error);
    }
  }

  async logOut(): Promise<any>{ 
    try{
      await this.afAuth.signOut();
    }catch(error){
      console.log('error logOut: ', error);
    }
  }

  async registrar(usuario:UsuarioInterface):Promise<UsuarioInterface | any>{
    try {
      
      this.usuario$.uid = await (await this.afAuth.createUserWithEmailAndPassword(usuario.email, usuario.psw)).user?.uid;
      //usuario.psw = EncriptarService.encrypt(usuario.psw);

      await firebase.default.auth().currentUser?.updateProfile({ displayName: usuario.displayName });
      console.log("registrar() -> this.usuario$.uid: ", this.usuario$.uid);
      usuario.uid = this.usuario$.uid;
      await this.usuarioServicio.guardarUsuario(usuario, this.usuario$.id);
      return this.usuario$;
    } catch (error) {
      console.log('error en registrar: ', error)
    }
  }
  
  async registraPorfavor(usuario: UsuarioInterface): Promise<UsuarioInterface| any>{
    return await new Promise( async (resuelve, rechaza) => {
      try {
        this.usuario$ = await (await this.afAuth.createUserWithEmailAndPassword(usuario.email, usuario.psw)).user?.uid;
        //this.usuario$ = await (await this.afAuth.createUserWithEmailAndPassword(usuario.email, usuario.psw));
        await firebase.default.auth().currentUser?.updateProfile({ displayName: usuario.displayName });
        return await resuelve(this.usuario$);
      } catch (error) {
        return await rechaza(error.message);
      }
    });
  }

  async registrar2(usuario: UsuarioInterface):Promise<UsuarioInterface | any>{
    try {
      this.usuario$ = await (await firebase.default.auth().createUserWithEmailAndPassword(usuario.email, usuario.psw))
      .credential?.toJSON();
      console.log("registrar() -> ", this.usuario$);
      return this.usuario$;
    } catch (error) {
      
    }
  }

  async getUsuarioActual(): Promise<any>{
    try{
      return await this.afAuth.authState.pipe(first()).toPromise();
    }catch(error){
      console.log('error getUsuarioActual: ', error);
    }
  }

  signIn(uid:string){
    return this.coleccionDeptos.ref;
  }

  getDeptos(){return this.coleccionDeptos;}

  async getDeptos_async():Promise<DepartamentoInterface[]>{
    this.deptos=[];
    return new Promise(async (resolve, reject) =>{
      try {
        await this.coleccionDeptosFirestore.get().then((querySnapshot: any[]) => {
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              //console.log(doc.id, " => ", doc.data());
              this.deptos.push(doc.data());
          });
          resolve(this.deptos);
        });
      } catch (error) {
        reject(error.message);
      }
    });

  }
  
  getDepartamento(id: string){
    return this.coleccionDeptos.doc(id);
  }

  async getDepartamento_async(id: string, element: any):Promise<DepartamentoInterface>{
    return new Promise(async (resolve,reject) => {
      try {
        await this.coleccionDeptos.doc(id).get()
            .subscribe((doc:DepartamentoInterface | any)=>{
              if(doc.exists){
                this.deptoInterface = doc.data();
                this.servicios.getSST_id_async(element.id)
                          .then(doc => {
                            if(doc.exists){
                              this.ssti = doc.data();
                              //GenerarPDFService.generaPDF_ST(this.ssti,this.deptoInterface,Number(this.ssti.folio),this.ssti.id);
                            }else{
                              alert("No sé encontro el documento en las base de las solicitudes de servicio de transporte");
                            }
                          })
                ;
              }else{
                alert("No se encontró el documento!!!");
              }
            });
        resolve(this.deptoInterface);
      } catch (error) {
        return reject(error.message);
      } 
    });
  }
  
  async getDepto_async(idDepto: string):Promise<DepartamentoInterface>{
    return new Promise(async (resuelve, rechaza) =>{
      try {
        await this.coleccionDeptosFirestore.doc(idDepto).get()
                .then((doc: {
                              exists: any;
                              data: () => DepartamentoInterface;})=>{
                  if (doc.exists){
                    this.deptoInterface = doc.data();
                    return resuelve(this.deptoInterface);
                  }
                });
      } catch (error) {
        return rechaza(error.message);
      }
    });
  }

  async getIdDeptoXdepartamento(departamento_id: string):Promise<string>{
    this.deptos = [];
    return new Promise( async (resuelve, rechaza) => {
      try {
        await this.coleccionDeptosFirestore.where("departamento","==",departamento_id)
                .get().then((query:any) =>{
                  query.forEach((doc:any) => {
                    this.deptos.push(doc.data());
                  })
                  this.idDepto = this.deptos[0].id;
                  return resuelve(this.idDepto);
                });
      } catch (error) {
        return rechaza(error.message);
      }
    });
  }

  getDeptoDepartamento(departamento: string){return this.coleccionDeptos.ref;}


}