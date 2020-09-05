import { DesafioStatus } from './../desaftio-status.enum';
import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class AtualizarDesafioDto {

    @IsOptional()
    dataHoraDesafio: Date;

    @IsOptional()
    status: DesafioStatus;

}