import * as CryptoJS from 'crypto-js';

export class EncriptarService {

  private static key: string = "♪☼§ihm";
  private static keye: string = "hikuri";
  private static txtcryp: string | undefined;
  private static txtdecryp: string | undefined;

  static async encrypt(psw: string):Promise<string>{
    this.txtcryp = CryptoJS.AES.encrypt(psw.trim(),this.key.trim()).toString();
    return await this.txtcryp;
  }
    
  static async desencriptar(psw:string):Promise<string>{
    return new Promise(async(resuelve, rechaza)=>{
      try {
        this.txtdecryp = CryptoJS.AES.decrypt(psw.trim(), this.key.trim()).toString(CryptoJS.enc.Utf8);
        return resuelve(this.txtdecryp) ;
      } catch (error:any) {
        return rechaza(error.message);
      }
    });

    
  }
}


