export interface SolicitudSIn{
    id?: string;
    folio?: string;
    departamento_id?: string;
    uid?: string;

    dateSol?: Date;
    dateCom?: Date;
    dateAcuse?: Date;
    dateFinSer?: Date;
    dateConformidad?: Date;

    fechaSol: string;
    tServicio: string;
    infAd: string;
    fechaCompromiso: string;
    usuario: string;

    acuse: string;
    obs: string;
    fechaConformidad: string;
}