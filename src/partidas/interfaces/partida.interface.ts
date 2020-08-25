import { Document } from 'mongoose';
import { Jogador } from '../../jogadores/interfaces/jogador.interface';

export interface Partida extends Document {
    readonly partida: string;
    def: Jogador;
    resultado: Resultado[];
    jogadores: Jogador[]; 
}

export interface Resultado {
    set: string;
}