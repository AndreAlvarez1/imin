export class EventoModel {
    id: string;
    nombre: string;
    config: {
                tipo: string
                cupos: number
                diferenciado: boolean
                hombres: number
                mujeres: number
                listaEspera: boolean;
                needPass: boolean;
                password: string;
            };
    creadoPor: string;
    creatorId: string;
    created_at: Date;
    detalle: string;
    fechas: {
            corte: boolean;
            fechaEvento: string;
            fechaFin: string;
            fechaIni: string;
            hora: string;
            };
    address: {
                lugar: string;
                direccion: string;
                lat: number;
                lng: number;
                id: string;
    };
    inscritos: any;
    status: number;

    constructor() {
        this.status = 1;
        this.inscritos = 'vacio';
        this.address = {
                            lugar: '',
                            direccion: '',
                            lat: 0,
                            lng: 0,
                            id: 'none'
                        };
        this.fechas = {
                        corte: false,
                        fechaEvento: '',
                        fechaFin:  '',
                        fechaIni:  '',
                        hora:  ''
            };
    }
}

