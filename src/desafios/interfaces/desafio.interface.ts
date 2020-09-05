import { Document } from 'mongoose';

import { Partida } from './partida.interface';
import { Jogador } from './../../jogadores/interfaces/jogador.interface';

export interface Desafio extends Document {
    dataHoraDesafio: Date;
    status: string;
    dataHoraSolicitacao: Date;
    dataHoraResposta: Date;
    solicitante: Jogador;
    categoria: string;
    jogadores: Jogador[];
    partida: Partida;
}