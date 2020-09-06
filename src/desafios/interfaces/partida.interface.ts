import { Document } from 'mongoose';
import { Jogador } from '../../jogadores/interfaces/jogador.interface';

export interface Partida extends Document {
    categoria: string;
    resultado: Resultado[];
    def: Jogador;
    jogadores: Jogador[]; 
}

export interface Resultado {
    set: string;
}