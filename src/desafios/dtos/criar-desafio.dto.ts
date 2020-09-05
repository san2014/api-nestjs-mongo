import { Jogador } from './../../jogadores/interfaces/jogador.interface';
import { IsNotEmpty, IsArray, ArrayMinSize, IsDateString, ArrayMaxSize } from 'class-validator';

export class CriarDesafioDto {

    @IsNotEmpty()
    @IsDateString()
    dataHoraDesafio: Date;

    @IsNotEmpty()
    solicitante: Jogador;

    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    jogadores: Jogador[];

}