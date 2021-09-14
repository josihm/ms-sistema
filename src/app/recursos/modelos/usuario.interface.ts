export interface UsuarioInterface{
    id?: string;
    uid?:string;
    email: string;
    displayName?: string | null;
    emailVerified?: boolean;
    phoneNumber?: string | null;
    isAnonympus?: boolean;
    psw: string;
    photoURL?: string;
    rol?: string;
}
export type Roles = "OFT" | "OFJ" | "JARDINERO" | 
                    "SECRETARIO" | "ADMIN" | "DEPARTAMENTO"