export interface SolicitudSTI{
    id?: string;
    folio: string;
    departamento_id?: string;
    uid?: string;
    destino: string;
    
    dateSalida?: Date;
    dateRegreso?: Date;
    dateFechaSol?: Date;

    salidaSt: string;
    regresoSt: string;
    horaS: string;
    horaR: string;
    fechaSol: string;
    fechaSolImp?: string;
    tServicio: string;
    tTransporte: string;
    infAd: string;
    nPasajeros: string;
    pasajeros: string;
}