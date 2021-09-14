import * as CryptoJS from 'crypto-js';

export class EncriptarService {

  private static key: string = "♪☼§ihm";
  private static keye: string = "hikuri";
  private static txtcryp: string | undefined;
  private static txtdecryp: string | undefined;

  static encrypt(psw: string):string{
    this.txtcryp = CryptoJS.AES.encrypt(psw.trim(),this.key.trim()).toString();
    console.log('this.txtcryp', this.txtcryp);
    return this.txtcryp;
  }
    
  static desencriptar(psw:string){
    this.txtdecryp = CryptoJS.AES.decrypt(psw.trim(), this.key.trim()).toString(CryptoJS.enc.Utf8);
    return this.txtdecryp;
  }
}


