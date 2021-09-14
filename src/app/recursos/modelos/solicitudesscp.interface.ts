export interface SolicitudSCPI{
    id?: string;
    folio: string;
    departamento_id?: string;
    uid?: string;
    remitente: string;
    destinatario: string;
    destino: string;
    entrega: string;
    tCorrespondencia: string;
    formaEnvio: string;
    fechaSol: string;

    fechaSolImp?: string;
    
    cantidad: string;
    tEnvio: string;
    infAd: string;
    anexo: string;

    dateEntrega?: Date;
    dateFechaSol?: Date;
}