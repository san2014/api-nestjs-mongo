import { IsNotEmpty, IsString, ArrayMinSize, IsArray } from "class-validator";

import { Resultado } from '../interfaces/partida.interface';
import { Jogador } from './../../jogadores/interfaces/jogador.interface';

export class CriarPartidaDto {

    def: Jogador;

    @IsArray()
    @ArrayMinSize(2)
    resultado: Resultado[];

    @IsArray()
    @ArrayMinSize(2)    
    jogadores: Jogador[];
    
}