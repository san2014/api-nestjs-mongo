import { Jogador } from './../../jogadores/interfaces/jogador.interface';
import { IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class CriarDesafioDto {

    @IsNotEmpty()
    dataHoraDesafio: Date;

    @IsNotEmpty()
    solicitante: Jogador;

    @IsArray()
    @ArrayMinSize(2)
    jogadores: Jogador[];

}