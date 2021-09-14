export interface DepartamentoInterface{
    id?: string;
    uid?: string;
    departamento: string;
    titular: string;
    correosind: string;
    teldirecto: string;
    ext: string;
    ext2: string;
    psw: string;
    rol?: Roles;
}
export type Roles = "ADMIN" | "USUARIO" | "EDITOR" | "SUSCRIPTOR"